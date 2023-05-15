#include "stm32f10x.h"                  // Device header
#include "DHT11.h"
#include "Delay.h"

void DHT11_IO_OUT (void){ //温湿度模块输出函数
	
	GPIO_InitTypeDef  GPIO_InitStructure; 	
    GPIO_InitStructure.GPIO_Pin = DHT11_IO; //选择端口号（0~15或all）                        
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP; //推挽输出       
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz; //设置IO接口速度（2/10/50MHz）    
	GPIO_Init(DHT11_PORT, &GPIO_InitStructure);
}

void DHT11_IO_IN (void){ //温湿度模块输入函数
	GPIO_InitTypeDef  GPIO_InitStructure; 	
    GPIO_InitStructure.GPIO_Pin = DHT11_IO; //选择端口号（0~15或all）                        
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING; //浮空输入      
	GPIO_Init(DHT11_PORT, &GPIO_InitStructure);
}

void DHT11_RST (void){ 						//DHT11端口复位，发出起始信号（IO发送）
	DHT11_IO_OUT();							//端口为输出
	GPIO_ResetBits(DHT11_PORT,DHT11_IO); 	//使总线为低电平
	delay_ms(20); 							//拉低至少18ms						
	GPIO_SetBits(DHT11_PORT,DHT11_IO); 		//使总线为高电平							
	Delay_us(30); 							//主机拉高20~40us
}

u8 DHT11_Check(void){ 	//等待DHT11回应，返回1:未检测到DHT11，返回0:成功（IO接收）	   
    u8 retry=0;			//定义临时变量
    DHT11_IO_IN();		//IO到输入状态	 
//GPIO端口输入时，配置为上拉输入或者浮空输入，因为外接上拉电阻，所以默认为高电平
//有负信号输入，GPIO端口为0，当GPIO端口为1且retry小于100，retry自加，否则跳出循环执行下一步
	while ((GPIO_ReadInputDataBit(DHT11_PORT,DHT11_IO) == 0) && retry<100)	//DHT11会拉低40~80us
	{
		retry++;
        Delay_us(1);
    }
    if(retry>=100)return 1; 	
	else retry=0;
//DHT11发来高电平信号，GPIO端口为0，当GPIO端口为0且retry小于100，retry自加，否则跳出循环执行下一步
    while ((GPIO_ReadInputDataBit(DHT11_PORT,DHT11_IO) == 1) && retry<100)  //DHT11拉低后会再次拉高40~80us
	{  
        retry++;
        Delay_us(1);
    }
    if(retry>=100)return 1;	    
    return 0;
}

u8 DHT11_Init (void){	//DHT11初始化
	RCC_APB2PeriphClockCmd(DHT11_RCC,ENABLE);	//开始DHT11的时钟
	DHT11_RST();								//DHT11端口复位，发出起始信号
	return DHT11_Check(); 						//等待DHT11回应
}

//从DHT11读取一个位
//返回值：1/0
u8 DHT11_Read_Bit(void)
{
    u8 retry = 0;
    while((GPIO_ReadInputDataBit(DHT11_PORT,DHT11_IO) == 1) && retry < 100) //等待变为低电平
    {
        retry++;
        Delay_us(1);
    }
    retry = 0;
    while((GPIO_ReadInputDataBit(DHT11_PORT,DHT11_IO) == 0) && retry < 100) //等待变高电平
    {
        retry++;
        Delay_us(1);
    }
    Delay_us(40);//等待40us
    if(GPIO_ReadInputDataBit(DHT11_PORT,DHT11_IO) == 1)       //用于判断高低电平，即数据1或0
        return 1;
    else
        return 0;
}

//从DHT11读取一个字节
//返回值：读到的数据
u8 DHT11_Read_Byte(void)
{
    u8 i, dat;
    dat = 0;
    for (i = 0; i < 8; i++)
    {
        dat <<= 1;					//左移运算符,dat左移1位
        dat |= DHT11_Read_Bit();	//"|"表示按位或等于
    }
    return dat;
}

//从DHT11读取一次数据
//temp:温度值(范围:0~50°)
//humi:湿度值(范围:20%~90%)
//返回值：0,正常;1,读取失败
u8 DHT11_Read_Data(u8 *temp, u8 *humi)
{
    u8 buf[5];
    u8 i;
    DHT11_RST();						//DHT11端口复位，发出起始信号
    if(DHT11_Check() == 0)				//等待DHT11回应，0为成功回应
    {
        for(i = 0; i < 5; i++) 			//读取40位数据
        {
            buf[i] = DHT11_Read_Byte();	//读出数据
        }
        if((buf[0] + buf[1] + buf[2] + buf[3]) == buf[4])	//数据校验
        {
            *humi = buf[0];				//将湿度值放入指针humi
            *temp = buf[2];				//将温度值放入指针temp
        }
    }
    else return 1;
    return 0;
}



#include "stm32f10x.h"                  // Device header
#include "usart.h"
#include "delay.h"
#include <string.h>
#include "SIM800L.h"
#include <stdio.h>

//unsigned char PhoneNO[]= "13795934074"; //接收方号码
extern unsigned char SIM800L_buff[64];  //内容
unsigned short SIM800L_cnt = 0, SIM800L_cntPre = 0;

//==========================================================
//	函数名称：	ESP8266_Clear
//
//	函数功能：	清空缓存
//
//	入口参数：	无
//
//	返回参数：	无
//
//	说明：		
//==========================================================
void SIM800L_Clear(void)
{

	memset(SIM800L_buff, 0, sizeof(SIM800L_buff));
	SIM800L_cnt = 0;

}

//==========================================================
//	函数名称：	ESP8266_WaitRecive
//
//	函数功能：	等待接收完成
//
//	入口参数：	无
//
//	返回参数：	REV_OK-接收完成		REV_WAIT-接收超时未完成
//
//	说明：		循环调用检测是否接收完成
//==========================================================
_Bool SIM800L_WaitRecive(void)
{

	if(SIM800L_cnt == 0) 							//如果接收计数为0 则说明没有处于接收数据中，所以直接跳出，结束函数
		return REV_WAIT;
		
	if(SIM800L_cnt == SIM800L_cntPre)				//如果上一次的值和这次相同，则说明接收完毕
	{
		SIM800L_cnt = 0;							//清0接收计数
			
		return REV_OK;								//返回接收完成标志
	}
		
	SIM800L_cntPre = SIM800L_cnt;					//置为相同
	
	return REV_WAIT;								//返回接收未完成标志

}

//==========================================================
//	函数名称：	SIM800L_SendCmd
//
//	函数功能：	发送命令
//
//	入口参数：	cmd：命令
//				res：需要检查的返回指令
//
//	返回参数：	0-成功	1-失败
//
//	说明：		
//==========================================================
_Bool SIM800L_SendCmd(char *cmd, char *res)
{
	
	int timeOut = 500;

	Usart_SendString(USART1, (unsigned char *)cmd, strlen((const char *)cmd));
	while(timeOut--)
	{
		if(SIM800L_WaitRecive() == REV_OK)							//如果收到数据
		{
			if(strstr((const char *)SIM800L_buff, res) != NULL)		//如果检索到关键词
			{
				SIM800L_Clear();									//清空缓存
				
				return 0;
			}
		}
		delay_ms(10);
	}
	
	return 1;

}

//==========================================================
//	函数名称：	SIM800L_SendData
//
//	函数功能：	发送数据
//
//	入口参数：	data：数据
//				len：长度
//
//	返回参数：	无
//
//	说明：		
//==========================================================
void SIM800L_SendData(unsigned char *data, unsigned short len, char *res)
{
	delay_ms(500);

	char cmdBuf[32];
	
	SIM800L_Clear();								//清空接收缓存
	sprintf(cmdBuf, "AT+CMGS=\"17744310976\"\r\n");		//发送命令
	if(!SIM800L_SendCmd(cmdBuf, ">"))				//收到‘>’时可以发送数据
	{
		Usart_SendString(USART1, data, len);		//发送设备连接请求数据
	}
	delay_ms(500);
	Usart_SendHexWord(USART1,0x1A);
	
//	while(strstr((const char *)SIM800L_buff, res) != NULL)		//如果检索到关键词
//	{
//		SIM800L_Clear();									//清空缓存
//		UsartPrintf(USART2, "发送成功\r\n");
//		return 0;
//	}
//	return 1;
}

void SIM800L_Init(void){
	SIM800L_Clear();
	SIM800L_RESET();
	
	while(SIM800L_SendCmd("AT\r\n", "OK"))
		delay_ms(500);
	
	
	while(SIM800L_SendCmd("AT+CMGF=1\r\n", "OK"))
		delay_ms(500);
	
	
	while(SIM800L_SendCmd("AT+CSCS=\"GSM\"\r\n", "OK"))
		delay_ms(500);
	
	
}

void SIM800L_RESET(void){
	
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB,ENABLE);
	GPIO_InitTypeDef GPIO_InitStructure;
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_8;
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	
	GPIO_Init(GPIOA,&GPIO_InitStructure);	
	
	GPIO_ResetBits(GPIOB,GPIO_Pin_8);
	delay_ms(10);
	GPIO_SetBits(GPIOB,GPIO_Pin_8);
	
}
void USART1_IRQHandler(void)
{
	if(USART_GetITStatus(USART1, USART_IT_RXNE) != RESET) //接收中断
	{
		
		if(SIM800L_cnt >= sizeof(SIM800L_buff))	SIM800L_cnt = 0; //防止串口被刷爆
		SIM800L_buff[SIM800L_cnt++] = USART1->DR;
		
		USART_ClearFlag(USART1, USART_FLAG_RXNE);
	}
}

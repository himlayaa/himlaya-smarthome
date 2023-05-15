//stm32头文件
#include "stm32f10x.h"                  // Device header

//C库
#include <stdio.h>
#include <stdarg.h>

//硬件驱动
#include "Delay.h"				//系统延时
#include "menu.h"				//OLED菜单
#include "base.h"				//u8g2配置
#include "exti.h"				//外部中断
#include "led.h"				//LED灯
#include "beep.h"				//蜂鸣器
#include "DHT11.h"				//温湿度传感器
#include "BH1750.h"				//光照度传感器
#include "timer.h"				//定时器
#include "AD.h"					//MQ-2烟雾AD数据采集
#include "pwm.h"				//PWM驱动
#include "elecRelay.h"			//继电器
#include "motor.h"				//电机
#include "usart.h"				//串口
#include "esp8266.h"			//WIFI连接，订阅发布
#include "onenet.h"				//数据上传，MQTT搭建
#include "changhong.h"			//空调红外数据
#include "SIM800L.h"




u8 temper;  	   //温度
u8 humi;		   //湿度
u16 smoke;     	   //烟雾
u8 temp;		   //临时变量
float light;	   //光照度
u8 alarmFlag,beepFlag;	   //警报标志
u8 Motor_flag;
u8 Wind_flag;
u8 Wind_speed[5] = {0,5,10,15,20};	   //通风速度
u8 Wind_value;
u8 LED1_pwm;	   //LED1亮度pwm值
u8 LED2_pwm;	   //LED2亮度pwm值
u8 Air_value = 0;	   //空调温度
u8 Air_value_before = 0; //空调之前温度
u8 Air_flag = 0;
u8 Elec1_value;    //电器1开关标志
u8 Elec2_value;    //电器2开关标志
u8 alarm_free = 5; //检测是否手动，即为0
char Pub_Buf[256]; //上传数据的buff
char brand [10] = {"changhong"};   //空调品牌
unsigned char SIM800L_buff[64];
uint8_t ui_index,ui_state;

const char *device_Sub_topics[] = {"/himlayasmarthome/sub"};
const char *device_Pub_topics = {"/himlayasmarthome/pub"};


int main(void)
{
	unsigned short timeCount = 0;	//发送间隔变量
	unsigned char *dataPtr = NULL;  //从上位机订阅的数据
	
	NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);	//中断控制器分组设置


	Tim_PWM_Init();
	beep_Init();
	DHT11_Init();
	BH1750_Init();
	AD_Init();
	elecRelay_Init();
	Motor_Init();
	

	
	Usart2_Init(115200);					//串口2，驱动ESP8266用
	Usart3_Init(115200);					//串口3，红外发射
	Usart1_Init(115200);					//串口1，调试/SIM发短信


	SIM800L_Init();
	
	
	ESP8266_Init();					//初始化ESP8266
	
	while(OneNet_DevLink());			//接入OneNET
	delay_ms(500);
//	
	
	//	beep_ON();				//蜂鸣器提示接入成功
//	delay_ms(200);
//	beep_OFF();
	
	setup_u8g2();
	setup();
	
	
	TIM3_Init(2499,7199);     //定时器3初始化，定时250ms进一次中断
	OneNet_Subscribe(device_Sub_topics, 1);
	

	
	while(1){
		loop();
		if(Air_flag){
			int cur = Air_value - 15;
			if(cur > 0 )Usart_SendString(USART3,code[cur],280);
			else Usart_SendString(USART3,code[0],280);
			USART3_Clear();
			Air_flag = 0;
		}
		
		if(timeCount % 8 == 0){
//			/***********温湿度传感器获取数据*********/
			temp = DHT11_Read_Data(&temper,&humi);  //

//		
//			/***********光照度传感器获取数据*********/
			if (!i2c_CheckDevice(BH1750_Addr)){	
				light = LIght_Intensity();

			}

//			/***********烟雾传感器获取数据*********/
			smoke = AD_GetValue();
			 

			//自动报警控制
			if(alarm_free == 5){
				if(humi > 95){ //漏水
					alarmFlag = 1;
					//SIM800L_Init();
					//SIM800L_SendData("Water leak!",11,"OK");
				}else if(smoke > 60 && temper < 50){ //燃气泄露
					alarmFlag = 1;
					Wind_value = Wind_speed[2];
					Wind_flag = 1;
					//SIM800L_Init();
					//SIM800L_SendData("Gas leak!",9,"OK");
				}else if(temper < 50 && light < 30000 && humi < 90 && smoke < 60){ //正常情况
					
					alarmFlag = 0;
					Wind_flag = Motor_flag == 1 ? 1 : 0;
					
				}else{ //着火了
					alarmFlag = 1;
					//SIM800L_Init();
					//SIM800L_SendData("Catch fire!",11,"OK");
				}
			}
			if(alarm_free < 5)alarm_free++;
			
			}
		if(++timeCount >= 40){	//发送间隔5s
			
			sprintf(Pub_Buf,"{\"Temp\":%d,\"Humi\":%d,\"Smoke\":%d,\"Light\":%d,\"Wind\":%d,\"Beep\":%d,\"LED1\":%d,\"LED1\":%d,\"Elec1_value\":%d,\"Elec2_value\":%d}",
			temper,humi,smoke,(int)light,Wind_flag,beepFlag,LED1_pwm,LED2_pwm,Elec1_value,Elec2_value);
			OneNet_Publish(device_Pub_topics, Pub_Buf);//数据上传
			
			timeCount = 0;
			ESP8266_Clear();
		}		
		dataPtr = ESP8266_GetIPD(3); //ESP8266订阅云服务器的topic接收命令
		if(dataPtr != NULL)
		OneNet_RevPro(dataPtr);	
		delay_ms(10);
	
	}		
}	

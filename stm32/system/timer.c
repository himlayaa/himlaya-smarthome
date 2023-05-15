#include "stm32f10x.h"                  // Device header
#include "timer.h"
#include "menu.h"				//OLED菜单
#include "beep.h"
#include "led.h"
#include <string.h>
#include <stdio.h>
#include "pwm.h"
#include "elecRelay.h"
#include "usart.h"
#include "menu.h"
#include "base.h"
#include "onenet.h"
#include "esp8266.h"
#include "motor.h"

char OLED_Buf[26];
extern u8 temper;  	    
extern u8 humi;
extern u16 smoke;     	   //烟雾
extern float light;
extern u8 alarmFlag,beepFlag;
extern u8 Wind_speed[5];	   //
extern u8 Wind_value;
extern u8 Wind_flag;
extern u8 Elec1_value; 
extern u8 Elec2_value;
extern u8 LED1_pwm;
extern u8 LED2_pwm;
extern u8 Air_value;
extern float Step_dev[4];
extern u8 Air_value_before;
extern u8 Air_flag;
extern char Pub_Buf[256]; // 上传数据的buff
extern char brand[10];
extern uint8_t ui_index,ui_state;
extern const char *device_Pub_topics;


void TIM2_Init(u16 arr,u16 psc)
{
    TIM_TimeBaseInitTypeDef  TIM_TimeBaseStructure;
	NVIC_InitTypeDef NVIC_InitStructure;

	RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE); //时钟使能

	TIM_TimeBaseStructure.TIM_Period = arr; //设置在下一个更新事件装入活动的自动重装载寄存器周期的值	 计数到5000为500ms
	TIM_TimeBaseStructure.TIM_Prescaler =psc; //设置用来作为TIMx时钟频率除数的预分频值  10Khz的计数频率  
	TIM_TimeBaseStructure.TIM_ClockDivision = 0; //设置时钟分割:TDTS = Tck_tim
	TIM_TimeBaseStructure.TIM_CounterMode = TIM_CounterMode_Up;  //TIM向上计数模式
	TIM_TimeBaseInit(TIM2, &TIM_TimeBaseStructure); //根据TIM_TimeBaseInitStruct中指定的参数初始化TIMx的时间基数单位
 
	TIM_ITConfig(  //使能或者失能指定的TIM中断
		TIM2, //TIM2
		TIM_IT_Update ,
		ENABLE  //使能
		);
	NVIC_InitStructure.NVIC_IRQChannel = TIM2_IRQn;  //TIM3中断
	NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 0;  //先占优先级0级
	NVIC_InitStructure.NVIC_IRQChannelSubPriority = 3;  //从优先级3级
	NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE; //IRQ通道被使能
	NVIC_Init(&NVIC_InitStructure);  //根据NVIC_InitStruct中指定的参数初始化外设NVIC寄存器

	TIM_Cmd(TIM2, ENABLE);  //使能TIMx外设						 
}


void TIM2_IRQHandler(void){
	if(TIM_GetITStatus(TIM2,TIM_IT_Update) == SET){
		TIM_ClearITPendingBit(TIM2,TIM_IT_Update);
		//loop();
//		UsartPrintf(USART_DEBUG, "OneNet_Publish\r\n");  
//		sprintf(Pub_Buf,"{\"Temp\":%d,\"Humi\":%d,\"Smoke\":%d,\"Light\":%d,\"Wind\":%d,\"Beep\":%d,\"LED1\":%d,\"LED2\":%d,\"Elec1_value\":%d,\"Elec1_value\":%d}",
//			temper,humi,smoke,(int)light,Wind_value,alarmFlag,LED1_pwm,LED2_pwm,Elec1_value,Elec2_value);
//			OneNet_Publish(device_Pub_topics, Pub_Buf);//基于TCP的MQTT协议数据上传
//		
//		ESP8266_Clear();
	}
}


void TIM3_Init(u16 arr,u16 psc){ //TIM3定时器负责蜂鸣器检测
	TIM_TimeBaseInitTypeDef  TIM_TimeBaseStructure;
	NVIC_InitTypeDef NVIC_InitStructure;

	RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM3, ENABLE); //时钟使能

	TIM_TimeBaseStructure.TIM_Period = arr; //设置在下一个更新事件装入活动的自动重装载寄存器周期的值	 计数到5000为500ms
	TIM_TimeBaseStructure.TIM_Prescaler =psc; //设置用来作为TIMx时钟频率除数的预分频值  10Khz的计数频率  
	TIM_TimeBaseStructure.TIM_ClockDivision = 0; //设置时钟分割:TDTS = Tck_tim
	TIM_TimeBaseStructure.TIM_CounterMode = TIM_CounterMode_Up;  //TIM向上计数模式
	TIM_TimeBaseInit(TIM3, &TIM_TimeBaseStructure); //根据TIM_TimeBaseInitStruct中指定的参数初始化TIMx的时间基数单位
 
	TIM_ITConfig(  //使能或者失能指定的TIM中断
		TIM3, //TIM3
		TIM_IT_Update ,
		ENABLE  //使能
		);
		
		//	TIM_ClearFlag(TIM3,TIM_FLAG_Update); //防止刚上电就进入中断
		//	TIM_ITConfig(TIM3,TIM_IT_Update,ENABLE);
	NVIC_InitStructure.NVIC_IRQChannel = TIM3_IRQn;  //TIM3中断
	NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 0;  //先占优先级0级
	NVIC_InitStructure.NVIC_IRQChannelSubPriority = 3;  //从优先级3级
	NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE; //IRQ通道被使能
	NVIC_Init(&NVIC_InitStructure);  //根据NVIC_InitStruct中指定的参数初始化外设NVIC寄存器

	TIM_Cmd(TIM3, ENABLE);  //使能TIMx外设	
}

void TIM3_IRQHandler(void){
	if(TIM_GetITStatus(TIM3,TIM_IT_Update) == SET){
		TIM_ClearITPendingBit(TIM3,TIM_IT_Update);
		
		if(beepFlag)BEEP=!BEEP;
		else BEEP=1;
		
		if(alarmFlag){  //自动警报开关
			beepFlag = 1;
			_clear();
			ui_index = M_WARNING;
		}
		
		PWM_SetCompare1(LED1_pwm); //由于PCB灯位置，换一下
		PWM_SetCompare2(LED2_pwm);
		
		
		if(Wind_flag){
			Motor_SetSpeed(Wind_value);
			PWM_SetCompare4(Wind_value); //电机转速灯
		} 
		
		//else{
			//Motor_SetSpeed(0);
			//PWM_SetCompare4(0); //电机转速灯
		//}
			
		if(Elec1_value != ELEC1_STATE) elecRelay_action(ELEC1,Elec1_value);
		if(Elec2_value != ELEC2_STATE) elecRelay_action(ELEC2,Elec2_value);
//		
//		if(Elec1_value) elecRelay_Open(ELEC1);  //继电器1开关
//		else elecRelay_Close(ELEC1);
//	
//		
//		if(Elec2_value) elecRelay_Open(ELEC2);  //继电器2开关
//		else elecRelay_Close(ELEC2);
			
		
		if(strstr(brand,"changhong") != NULL && Air_value_before != Air_value){
			//temp_change(Air_value);
			Air_value_before = Air_value;
			Air_flag = 1;
		}
		
		
	}
}

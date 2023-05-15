#include "stm32f10x.h"                  // Device header
#include "Delay.h"
#include "beep.h"
void beep_Init(void){
	
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB,ENABLE);	
	GPIO_InitTypeDef GPIO_InitStructure;
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5;
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOB,&GPIO_InitStructure);	
	
	GPIO_SetBits(GPIOB,GPIO_Pin_5); //นุ
}

void beep_ON(void){
	GPIO_ResetBits(GPIOB,GPIO_Pin_5);
	
}

void beep_OFF(void){
	GPIO_SetBits(GPIOB,GPIO_Pin_5);	
}

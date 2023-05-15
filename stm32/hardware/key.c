#include "stm32f10x.h"                  // Device header
#include "Delay.h"
#include "key.h"

void KEY_GPIO_Init(void){
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA,ENABLE);
	
	GPIO_InitTypeDef GPIO_InitStructure;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5 | GPIO_Pin_6 | GPIO_Pin_7;
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz; //输入模式下其实是没用的
	GPIO_Init(GPIOA,&GPIO_InitStructure);
	
}


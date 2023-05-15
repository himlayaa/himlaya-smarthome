#include "stm32f10x.h"                  // Device header
#include "elecRelay.h"

void elecRelay_Init(void){
	
	
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB,ENABLE);
	
	GPIO_InitTypeDef GPIO_InitStructure;
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_12 | GPIO_Pin_14;
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOB,&GPIO_InitStructure);
	
	GPIO_WriteBit(GPIOB,GPIO_Pin_12,Bit_RESET);
	GPIO_WriteBit(GPIOB,GPIO_Pin_14,Bit_RESET);
}


void elecRelay_Open(uint16_t ELECx){
	GPIO_WriteBit(GPIOB,ELECx,Bit_SET);
}
void elecRelay_Close(uint16_t ELECx){
	GPIO_WriteBit(GPIOB,ELECx,Bit_RESET);
}

void elecRelay_action(uint16_t ELECx, uint8_t state){
	if(state){
		GPIO_WriteBit(GPIOB,ELECx,Bit_SET);
	}else{
		GPIO_WriteBit(GPIOB,ELECx,Bit_RESET);
	}		
}
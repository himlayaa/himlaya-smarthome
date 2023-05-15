#ifndef _USART_H_
#define _USART_H_


#include "stm32f10x.h"


#define USART_DEBUG		USART1		//调试打印所使用的串口组


void Usart1_Init(unsigned int baud);

void Usart2_Init(unsigned int baud);
void Usart3_Init(unsigned int baud);

void Usart_SendString(USART_TypeDef *USARTx, unsigned char *str, unsigned short len);
void Usart_SendHexWord( USART_TypeDef * pUSARTx, uint16_t ch);
void UsartPrintf(USART_TypeDef *USARTx, char *fmt,...);
void USART3_Clear(void);

#endif

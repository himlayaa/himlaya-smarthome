#ifndef __TIMER_H
#define __TIMER_H 


void LED_PwmInit(void);
void LED_SetCompare(uint16_t compare);
void TIM3_Init(u16 arr,u16 psc);

#endif

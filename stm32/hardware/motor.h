#ifndef __MOTOR_H
#define __MOTOR_H

void PWM_Init(void);
void PWM_SetCompare(uint16_t compare);
void Motor_Init(void);
void Motor_SetSpeed(int8_t speed);

#endif
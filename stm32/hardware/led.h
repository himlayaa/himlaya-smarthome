#ifndef _LED_H
#define _LED_H
#include "sys.h"

#define LED PCout(13)   //PC13ºËĞÄ°åÉÏÂÌµÆ
void LED_Init(void);
void LED_ON(void);
void LED_OFF(void);
void LED_Turn(void);

#endif

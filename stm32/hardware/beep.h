#ifndef __BEEP_H
#define __BEEP_H
#include "sys.h"

#define BEEP PBout(5)   //PB5

void beep_Init(void);
void beep_ON(void);
void beep_OFF(void);

#endif

#ifndef __ELECRELAY_H
#define __ELECRELAY_H

#include "sys.h"

#define ELEC1 		GPIO_Pin_12   //¼ÌµçÆ÷1
#define ELEC2 		GPIO_Pin_14   //¼ÌµçÆ÷2

#define ELEC1_STATE 		PBin(12)
#define ELEC2_STATE			PBin(14)

void elecRelay_Init(void);
void elecRelay_Open(uint16_t ELECx);
void elecRelay_Close(uint16_t ELECx);
void elecRelay_action(uint16_t ELECx, uint8_t state);
#endif

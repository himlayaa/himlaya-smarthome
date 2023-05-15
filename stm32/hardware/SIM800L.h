#ifndef __SIM800L_H_
#define __SIM800L_H_

#define REV_OK		0	//接收完成标志
#define REV_WAIT	1	//接收未完成标志

void SIM800L_Clear(void);
_Bool SIM800L_WaitRecive(void);
_Bool SIM800L_SendCmd(char *cmd, char *res);
void SIM800L_SendData(unsigned char *data, unsigned short len, char *res);
void SIM800L_Init(void);
void SIM800L_RESET(void);


#endif

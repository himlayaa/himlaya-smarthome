#ifndef __OLED_H
#define __OLED_H		


#include "sys.h"
#include "stdlib.h"
#include "string.h" 	 
#include "delay.h"


//--------------OLED参数定义---------------------
#define PAGE_SIZE			8
#define XLevelL				0x00
#define XLevelH				0x10
#define YLevel				0xB0
#define	Brightness		0xFF 
#define WIDTH					128
#define HEIGHT				64	


//-------------写命令和数据定义-------------------
#define OLED_CMD			0		//写命令
#define OLED_DATA			1		//写数据 


//-----------------OLED端口定义----------------

#define OLED_RST_PIN		GPIO_Pin_8					//复位信号 RES
#define OLED_RST_PORT		GPIOA						//复位信号
#define OLED_RST_CLK		RCC_APB2Periph_GPIOA		//复位信号

#define OLED_DC_PIN			GPIO_Pin_15					//数据/命令控制信号 DC
#define OLED_DC_PORT		GPIOB						//数据/命令控制信号
#define OLED_DC_CLK			RCC_APB2Periph_GPIOB		//数据/命令控制信号

#define OLED_CS_PIN			GPIO_Pin_13 				//片选信号 CS
#define OLED_CS_PORT		GPIOB						//片选信号
#define OLED_CS_CLK			RCC_APB2Periph_GPIOB		//片选信号

#define SPI2_SCK_PIN		GPIO_Pin_12					//时钟信号 D0/SCL
#define SPI2_SCK_PORT		GPIOA						//时钟信号
#define SPI2_SCK_CLK		RCC_APB2Periph_GPIOA		//时钟信号

#define SPI2_MOSI_PIN		GPIO_Pin_11					//数据发送信号 D1/SDA
#define SPI2_MOSI_PORT	    GPIOA							//数据发送信号
#define SPI2_MOSI_CLK		RCC_APB2Periph_GPIOA		//数据发送信号

//-----------------OLED端口操作定义----------------
void OLED_Init_GPIO(void);		   


#endif



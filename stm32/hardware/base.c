#include "stm32f10x.h"                  // Device header
#include "base.h"
#include "Delay.h"
#include "u8g2.h"
#include "u8x8.h"
#include "OLED.h"

u8g2_t u8g2;

uint8_t u8x8_stm32_gpio_and_delay(U8X8_UNUSED u8x8_t *u8x8,
    U8X8_UNUSED uint8_t msg, U8X8_UNUSED uint8_t arg_int,
    U8X8_UNUSED void *arg_ptr)
{
  switch(msg)
  {
		case U8X8_MSG_DELAY_100NANO:		// delay arg_int * 100 nano seconds
				__NOP();
				break;
		case U8X8_MSG_DELAY_10MICRO:		// delay arg_int * 10 micro seconds
				for (uint16_t n = 0; n < 320; n++)
				{
					__NOP();
				}
				break;
    case U8X8_MSG_DELAY_MILLI:			// delay arg_int * 1 milli second
				delay_ms(1);
        break;
    case U8X8_MSG_DELAY_I2C:			// arg_int is the I2C speed in 100KHz, e.g. 4 = 400 KHz
				Delay_us(5);
				break;					// arg_int=1: delay by 5us, arg_int = 4: delay by 1.25us
		case U8X8_MSG_GPIO_SPI_DATA:
			  if(arg_int == 1)            // arg_int=1: Input dir with pullup high for I2C clock pin
        	GPIO_SetBits(GPIOA,SPI2_MOSI_PIN);
        else if(arg_int == 0)
        	//GPIO_ResetBits(GPIOB,SPI2_MOSI_PIN);
			GPIO_ResetBits(GPIOA,SPI2_MOSI_PIN);
				break;
		case U8X8_MSG_GPIO_SPI_CLOCK:
			  if(arg_int == 1)             // arg_int=1: Input dir with pullup high for I2C clock pin
        	GPIO_SetBits(GPIOA,SPI2_SCK_PIN);
        else if(arg_int == 0)
        	GPIO_ResetBits(GPIOA,SPI2_SCK_PIN);
				break;
		case U8X8_MSG_GPIO_CS:
			  if(arg_int == 1)             // arg_int=1: Input dir with pullup high for I2C clock pin
        	GPIO_SetBits(GPIOB,OLED_CS_PIN);
        else if(arg_int == 0)
        	GPIO_ResetBits(GPIOB,OLED_CS_PIN);
				break;
		case U8X8_MSG_GPIO_DC:
			  if(arg_int == 1)            // arg_int=1: Input dir with pullup high for I2C clock pin
        	GPIO_SetBits(GPIOB,OLED_DC_PIN);
        else if(arg_int == 0)
        	GPIO_ResetBits(GPIOB,OLED_DC_PIN);
				break;
		case U8X8_MSG_GPIO_RESET:
			  if(arg_int == 1)                                     // arg_int=1: Input dir with pullup high for I2C clock pin
        	GPIO_SetBits(GPIOA,OLED_RST_PIN);
        else if(arg_int == 0)
        	GPIO_ResetBits(GPIOA,OLED_RST_PIN);
				break;
    case U8X8_MSG_GPIO_MENU_SELECT:
        u8x8_SetGPIOResult(u8x8, /* get menu select pin state */ 0);
        break;
    case U8X8_MSG_GPIO_MENU_NEXT:
        u8x8_SetGPIOResult(u8x8, /* get menu next pin state */ 0);
        break;
    case U8X8_MSG_GPIO_MENU_PREV:
        u8x8_SetGPIOResult(u8x8, /* get menu prev pin state */ 0);
        break;
    case U8X8_MSG_GPIO_MENU_HOME:
        u8x8_SetGPIOResult(u8x8, /* get menu home pin state */ 0);
        break;
    default:
        u8x8_SetGPIOResult(u8x8, 1);			         // default return value
        break;
  }
  return 1;
}


void setup_u8g2(void){
	OLED_Init_GPIO();
	u8g2_Setup_ssd1306_128x64_noname_f(&u8g2, U8G2_R0, u8x8_byte_4wire_sw_spi, u8x8_stm32_gpio_and_delay);  
	u8g2_InitDisplay(&u8g2);
	u8g2_SetPowerSave(&u8g2,0);
	_clear(); 
}

#include "u8x8.h"

uint8_t u8x8_byte_SetDC(u8x8_t *u8x8, uint8_t dc)
{
  return u8x8->byte_cb(u8x8, U8X8_MSG_BYTE_SET_DC, dc, NULL);
}

uint8_t u8x8_byte_SendBytes(u8x8_t *u8x8, uint8_t cnt, uint8_t *data)
{
  return u8x8->byte_cb(u8x8, U8X8_MSG_BYTE_SEND, cnt, (void *)data);
}

uint8_t u8x8_byte_SendByte(u8x8_t *u8x8, uint8_t byte)
{
  return u8x8_byte_SendBytes(u8x8, 1, &byte);
}

uint8_t u8x8_byte_StartTransfer(u8x8_t *u8x8)
{
  return u8x8->byte_cb(u8x8, U8X8_MSG_BYTE_START_TRANSFER, 0, NULL);
}

uint8_t u8x8_byte_EndTransfer(u8x8_t *u8x8)
{
  return u8x8->byte_cb(u8x8, U8X8_MSG_BYTE_END_TRANSFER, 0, NULL);
}

/*=========================================*/

uint8_t u8x8_byte_empty(U8X8_UNUSED u8x8_t *u8x8, uint8_t msg, U8X8_UNUSED uint8_t arg_int, U8X8_UNUSED void *arg_ptr)
{
  switch(msg)
  {
    case U8X8_MSG_BYTE_SEND:
    case U8X8_MSG_BYTE_INIT:
    case U8X8_MSG_BYTE_SET_DC:
    case U8X8_MSG_BYTE_START_TRANSFER:
    case U8X8_MSG_BYTE_END_TRANSFER:
      break;	/* do nothing */
  }
  return 1;	/* always succeed */
}


/*=========================================*/


/*
  Uses:
    u8x8->display_info->sda_setup_time_ns
    u8x8->display_info->sck_pulse_width_ns
    u8x8->display_info->spi_mode
    u8x8->display_info->chip_disable_level
    u8x8->display_info->chip_enable_level
    u8x8->display_info->post_chip_enable_wait_ns
    u8x8->display_info->pre_chip_disable_wait_ns
  Calls to GPIO and DELAY:
    U8X8_MSG_DELAY_NANO
    U8X8_MSG_GPIO_DC
    U8X8_MSG_GPIO_CS
    U8X8_MSG_GPIO_CLOCK
    U8X8_MSG_GPIO_DATA
  Handles:
    U8X8_MSG_BYTE_INIT
    U8X8_MSG_BYTE_SEND
    U8X8_MSG_BYTE_SET_DC
    U8X8_MSG_BYTE_START_TRANSFER
    U8X8_MSG_BYTE_END_TRANSFER
*/

uint8_t u8x8_byte_4wire_sw_spi(u8x8_t *u8x8, uint8_t msg, uint8_t arg_int, void *arg_ptr)
{
  uint8_t i, b;
  uint8_t *data;
  uint8_t takeover_edge = u8x8_GetSPIClockPhase(u8x8);
  uint8_t not_takeover_edge = 1 - takeover_edge;
 
  switch(msg)
  {
    case U8X8_MSG_BYTE_SEND:
      data = (uint8_t *)arg_ptr;
      while( arg_int > 0 )
      {
	b = *data;
	data++;
	arg_int--;
	for( i = 0; i < 8; i++ )
	{
	  if ( b & 128 )
	    u8x8_gpio_SetSPIData(u8x8, 1);
	  else
	    u8x8_gpio_SetSPIData(u8x8, 0);
	  b <<= 1;
	  
	  u8x8_gpio_SetSPIClock(u8x8, not_takeover_edge);
	  u8x8_gpio_Delay(u8x8, U8X8_MSG_DELAY_NANO, u8x8->display_info->sda_setup_time_ns);
	  u8x8_gpio_SetSPIClock(u8x8, takeover_edge);
	  u8x8_gpio_Delay(u8x8, U8X8_MSG_DELAY_NANO, u8x8->display_info->sck_pulse_width_ns);
	}    
      }
      break;
      
    case U8X8_MSG_BYTE_INIT:
      /* disable chipselect */
      u8x8_gpio_SetCS(u8x8, u8x8->display_info->chip_disable_level);
      /* no wait required here */
      
      /* for SPI: setup correct level of the clock signal */
      u8x8_gpio_SetSPIClock(u8x8, u8x8_GetSPIClockPhase(u8x8));
      break;
    case U8X8_MSG_BYTE_SET_DC:
      u8x8_gpio_SetDC(u8x8, arg_int);
      break;
    case U8X8_MSG_BYTE_START_TRANSFER:
      u8x8_gpio_SetCS(u8x8, u8x8->display_info->chip_enable_level);  
      u8x8->gpio_and_delay_cb(u8x8, U8X8_MSG_DELAY_NANO, u8x8->display_info->post_chip_enable_wait_ns, NULL);
      break;
    case U8X8_MSG_BYTE_END_TRANSFER:
      u8x8->gpio_and_delay_cb(u8x8, U8X8_MSG_DELAY_NANO, u8x8->display_info->pre_chip_disable_wait_ns, NULL);
      u8x8_gpio_SetCS(u8x8, u8x8->display_info->chip_disable_level);
      break;
    default:
      return 0;
  }
  return 1;
}


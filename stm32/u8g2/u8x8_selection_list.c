#include "u8x8.h"

/*
  increase the cursor position
*/
void u8sl_Next(u8sl_t *u8sl)
{
  u8sl->current_pos++;
  if ( u8sl->current_pos >= u8sl->total )
  {
    u8sl->current_pos = 0;
    u8sl->first_pos = 0;
  }
  else
  {
    if ( u8sl->first_pos + u8sl->visible <= u8sl->current_pos + 1 )
    {
      u8sl->first_pos = u8sl->current_pos - u8sl->visible + 1;
    }
  }
}

void u8sl_Prev(u8sl_t *u8sl)
{
  if ( u8sl->current_pos == 0 )
  {
    u8sl->current_pos = u8sl->total - 1;
    u8sl->first_pos = 0;
    if ( u8sl->total > u8sl->visible )
      u8sl->first_pos = u8sl->total - u8sl->visible;
  }
  else
  {
    u8sl->current_pos--;
    if ( u8sl->first_pos > u8sl->current_pos )
      u8sl->first_pos = u8sl->current_pos;
  }
}

void u8x8_DrawSelectionList(u8x8_t *u8x8, u8sl_t *u8sl, u8x8_sl_cb sl_cb, const void *aux)
{
  uint8_t i;
  for( i = 0; i < u8sl->visible; i++ )
  {
    sl_cb(u8x8, u8sl, i+u8sl->first_pos, aux);
  }
}

import React, { useEffect, useRef } from 'react';
import { Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

/**
 * Reusable date range selector combining a preset Select and a RangePicker.
 * Props:
 * - preset: string ('today'|'yesterday'|'this_week'|'last_week'|'this_month'|'current_financial_year'|'custom')
 * - start: dayjs instance
 * - end: dayjs instance
 * - onChange: ({ preset, start, end }) => void (called immediately on change)
 * - style: container style (optional)
 */
const DateRangeSelector = ({ preset, start, end, onChange, style }) => {
  const datePickerRef = useRef(null);
  const computeRangeFromPreset = (presetKey) => {
    const today = dayjs();
    switch (presetKey) {
      case 'today':
        return { start: today.startOf('day'), end: today.endOf('day') };
      case 'yesterday': {
        const y = today.subtract(1, 'day');
        return { start: y.startOf('day'), end: y.endOf('day') };
      }
      case 'this_week':
        return { start: today.startOf('week'), end: today.endOf('week') };
      case 'last_week': {
        const s = today.startOf('week').subtract(1, 'week');
        const e = today.endOf('week').subtract(1, 'week');
        return { start: s, end: e };
      }
      case 'this_month':
        return { start: today.startOf('month'), end: today.endOf('month') };
      case 'current_financial_year': {
        const year = today.month() >= 3 ? today.year() : today.year() - 1;
        const s = dayjs(`${year}-04-01`).startOf('day');
        const e = dayjs(`${year + 1}-03-31`).endOf('day');
        return { start: s, end: e };
      }
      case 'custom':
      default:
        return { start, end };
    }
  };

  const handlePresetChange = (val) => {
    if (val === 'custom') {
      onChange({ preset: 'custom', start, end });
      return;
    }
    const { start: s, end: e } = computeRangeFromPreset(val);
    onChange({ preset: val, start: s, end: e });
  };

  // State to control the calendar open state
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  
  // Effect to auto-open the calendar when 'custom' is selected
  useEffect(() => {
    if (preset === 'custom') {
      setCalendarOpen(true);
      // Focus the input after a small delay
      setTimeout(() => {
        if (datePickerRef.current) {
          const input = datePickerRef.current.querySelector('input');
          if (input) {
            input.focus();
          }
        }
      }, 100);
    }
  }, [preset]);

  return (
    <div className="d-flex align-items-cenrter justify-content-center flex-md-row flex-column" style={{ gap: 12, ...(style || {}) }}>
      <Select
        value={preset}
        style={{ width: 120 }}
        onChange={handlePresetChange}
        options={[
          { label: 'Today', value: 'today' },
          { label: 'Yesterday', value: 'yesterday' },
          { label: 'This Week', value: 'this_week' },
          { label: 'Last Week', value: 'last_week' },
          { label: 'This Month', value: 'this_month' },
          { label: 'Current FY', value: 'current_financial_year' },
          { label: 'Custom', value: 'custom' },
        ]}
      />
      {preset === 'custom' && (
        <div ref={datePickerRef}>
          <DatePicker.RangePicker
            allowClear={false}
            value={[start, end]}
            open={calendarOpen}
            onOpenChange={(open) => setCalendarOpen(open)}
            onChange={(vals) => {
              if (!vals || vals.length !== 2) return;
              const s = vals[0].startOf('day');
              const e = vals[1].startOf('day');
              onChange({ preset: 'custom', start: s, end: e });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;




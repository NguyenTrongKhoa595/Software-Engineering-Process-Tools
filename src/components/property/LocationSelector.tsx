import { useState } from 'react';
import { Country, State, City } from 'country-state-city';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

export const VIETNAM_DATA: Record<string, string[]> = {
  'SG': [ // Ho Chi Minh City
    'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12',
    'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Phú Nhuận', 'Quận Gò Vấp', 'Quận Bình Tân',
    'Thành phố Thủ Đức', 'Huyện Hóc Môn', 'Huyện Củ Chi', 'Huyện Nhà Bè', 'Huyện Bình Chánh', 'Huyện Cần Giờ'
  ],
  'HN': [ // Hanoi
    'Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Tây Hồ', 'Quận Long Biên', 'Quận Cầu Giấy', 'Quận Đống Đa',
    'Quận Hai Bà Trưng', 'Quận Hoàng Mai', 'Quận Thanh Xuân', 'Quận Nam Từ Liêm', 'Quận Bắc Từ Liêm',
    'Quận Hà Đông', 'Thị xã Sơn Tây', 'Huyện Ba Vì', 'Huyện Chương Mỹ', 'Huyện Đan Phượng', 'Huyện Đông Anh',
    'Huyện Gia Lâm', 'Huyện Hoài Đức', 'Huyện Mê Linh', 'Huyện Mỹ Đức', 'Huyện Phú Xuyên', 'Huyện Phúc Thọ',
    'Huyện Quốc Oai', 'Huyện Sóc Sơn', 'Huyện Thạch Thất', 'Huyện Thanh Oai', 'Huyện Thanh Trì', 'Huyện Thường Tín', 'Huyện Ứng Hòa'
  ],
  'DN': [ // Da Nang
    'Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu', 'Quận Cẩm Lệ',
    'Huyện Hòa Vang', 'Huyện Hoàng Sa'
  ],
  'HP': [ // Hai Phong
    'Quận Hồng Bàng', 'Quận Lê Chân', 'Quận Ngô Quyền', 'Quận Kiến An', 'Quận Hải An', 'Quận Dương Kinh', 'Quận Đồ Sơn',
    'Huyện An Dương', 'Huyện An Lão', 'Huyện Bạch Long Vĩ', 'Huyện Cát Hải', 'Huyện Kiến Thụy', 'Huyện Thủy Nguyên', 'Huyện Tiên Lãng', 'Huyện Vĩnh Bảo'
  ],
  'CT': [ // Can Tho
    'Quận Ninh Kiều', 'Quận Bình Thủy', 'Quận Cái Răng', 'Quận Ô Môn', 'Quận Thốt Nốt',
    'Huyện Phong Điền', 'Huyện Cờ Đỏ', 'Huyện Vĩnh Thạnh', 'Huyện Thới Lai'
  ],
  '57': [ // Binh Duong
    'Thành phố Thủ Dầu Một', 'Thành phố Thuận An', 'Thành phố Dĩ An', 'Thành phố Tân Uyên', 'Thị xã Bến Cát',
    'Huyện Bàu Bàng', 'Huyện Dầu Tiếng', 'Huyện Phú Giáo', 'Huyện Bắc Tân Uyên'
  ],
  '39': [ // Dong Nai
    'Thành phố Biên Hòa', 'Thành phố Long Khánh', 'Huyện Long Thành', 'Huyện Nhơn Trạch', 'Huyện Trảng Bom',
    'Huyện Thống Nhất', 'Huyện Cẩm Mỹ', 'Huyện Vĩnh Cửu', 'Huyện Xuân Lộc', 'Huyện Định Quán', 'Huyện Tân Phú'
  ],
  '43': [ // Ba Ria - Vung Tau
    'Thành phố Vũng Tàu', 'Thành phố Bà Rịa', 'Thị xã Phú Mỹ', 'Huyện Châu Đức', 'Huyện Côn Đảo', 'Huyện Đất Đỏ', 'Huyện Long Điền', 'Huyện Xuyên Mộc'
  ]
};

interface LocationComboboxProps {
  value: string;
  onSelect: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  emptyText: string;
  disabled?: boolean;
}

const LocationCombobox = ({
  value,
  onSelect,
  options,
  placeholder,
  emptyText,
  disabled = false
}: LocationComboboxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-10"
          disabled={disabled}
        >
          <span className="truncate">
            {value
              ? options.find((opt) => opt.value === value)?.label || value
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onSelect(opt.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === opt.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface LocationSelectorProps {
  country: string;
  state: string;
  city: string;
  onCountryChange: (val: string) => void;
  onStateChange: (val: string) => void;
  onCityChange: (val: string) => void;
  showLabels?: boolean;
  className?: string;
  columnLayout?: boolean;
}

export const LocationSelector = ({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
  showLabels = true,
  className = "",
  columnLayout = true
}: LocationSelectorProps) => {
  const isVietnam = country === 'VN';

  return (
    <div className={cn("grid gap-4", columnLayout ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3", className)}>
      <div className="space-y-2">
        {showLabels && <Label>Country</Label>}
        <LocationCombobox
          value={country}
          onSelect={onCountryChange}
          options={Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }))}
          placeholder="Search country..."
          emptyText="No country found."
        />
      </div>

      <div className="space-y-2">
        {showLabels && <Label>{isVietnam ? 'Province / City' : 'State / Province'}</Label>}
        <LocationCombobox
          value={state}
          onSelect={onStateChange}
          options={State.getStatesOfCountry(country).map(s => ({ value: s.isoCode, label: s.name }))}
          placeholder="Select province/state"
          emptyText="No states found."
          disabled={!country}
        />
      </div>

      <div className="space-y-2">
        {showLabels && <Label>{isVietnam ? 'District' : 'City'}</Label>}
        <LocationCombobox
          value={city}
          onSelect={onCityChange}
          options={
            isVietnam && VIETNAM_DATA[state]
              ? VIETNAM_DATA[state].map(d => ({ value: d, label: d }))
              : City.getCitiesOfState(country, state).map(c => ({ value: c.name, label: c.name }))
          }
          placeholder="Select city/district"
          emptyText="No cities found."
          disabled={!state}
        />
      </div>
    </div>
  );
};

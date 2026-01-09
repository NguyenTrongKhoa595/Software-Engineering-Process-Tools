import { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, Plus, Check, ChevronsUpDown, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LocationSelector } from '@/components/property/LocationSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { PROPERTY_TYPES, AMENITIES } from '@/types/property';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { propertyApi, PropertyResponseDTO } from '@/lib/api/propertyApi';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';

interface PropertyFormModalProps {
  open: boolean;
  onClose: () => void;
  propertyId?: number | null;
  onSave: () => void;
}

interface FormData {
  title: string;
  description: string;
  address: string;
  rentAmount: string;
  securityDeposit: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  currency: string;
  furnished: boolean;
  petFriendly: boolean;
  parkingSpaces: string;
  amenities: string[];
  rules: string[];
  availableFrom: string;
  minimumLease: string;
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
}

const VIETNAM_DATA: Record<string, string[]> = {
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

const initialFormData: FormData = {
  title: '',
  description: '',
  address: '',
  rentAmount: '',
  securityDeposit: '',
  type: 'APARTMENT',
  bedrooms: '1',
  bathrooms: '1',
  size: '500',
  currency: 'USD',
  furnished: false,
  petFriendly: false,
  parkingSpaces: '0',
  amenities: [],
  rules: [],
  availableFrom: '',
  minimumLease: '12',
  country: 'VN',
  state: '',
  city: '',
  street: '',
  postalCode: '',
};

export function PropertyFormModal({ open, onClose, propertyId, onSave }: PropertyFormModalProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [property, setProperty] = useState<PropertyResponseDTO | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<{ id: number; url: string }[]>([]);
  const [photoIdsToDelete, setPhotoIdsToDelete] = useState<number[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');

  // Fetch property data if editing
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setProperty(null);
        resetForm();
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await propertyApi.getProperty(propertyId);
        setProperty(data);
        setFormData({
          title: data.title,
          description: data.description,
          address: data.address,
          rentAmount: String(data.rentAmount),
          securityDeposit: data.securityDeposit ? String(data.securityDeposit) : '',
          type: data.type || 'APARTMENT',
          bedrooms: String(data.bedrooms || 1),
          bathrooms: String(data.bathrooms || 1),
          size: String(data.size || 500),
          currency: data.currency || 'USD',
          furnished: data.furnished || false,
          petFriendly: data.petFriendly || false,
          parkingSpaces: String(data.parkingSpaces || 0),
          amenities: data.amenities || [],
            rules: data.rules || [],
            availableFrom: data.availableFrom || '',
            minimumLease: String(data.minimumLease || 12),
            country: 'Vietnam',
            state: '',
            city: '',
            street: '',
            postalCode: '',
          });

          // Try to parse existing address
          if (data.address) {
            const parts = data.address.split(',').map(p => p.trim());
            // Format: street, city, state, country
            if (parts.length >= 4) {
              const countryName = parts[parts.length - 1];
              const stateName = parts[parts.length - 2];
              const cityName = parts[parts.length - 3];
              const streetParts = parts.slice(0, parts.length - 3);

              const country = Country.getAllCountries().find(c => c.name === countryName);
              if (country) {
                const state = State.getStatesOfCountry(country.isoCode).find(s => s.name === stateName);
                
                // Check if last part is postal code or if we have 5 parts
                let pCode = '';
                let finalStreet = streetParts.join(', ');
                
                if (parts.length >= 5) {
                   pCode = parts[parts.length - 1]; // Assume last is postal if 5+
                }

                setFormData(prev => ({
                  ...prev,
                  country: country.isoCode,
                  state: state?.isoCode || '',
                  city: cityName,
                  street: finalStreet,
                  postalCode: pCode,
                }));
              }
            } else if (parts.length === 3) {
              // Fallback for street, city, country
              const countryName = parts[parts.length - 1];
              const cityName = parts[parts.length - 2];
              const streetParts = parts.slice(0, parts.length - 2);

              const country = Country.getAllCountries().find(c => c.name === countryName);
              setFormData(prev => ({
                ...prev,
                country: country?.isoCode || '',
                city: cityName,
                street: streetParts.join(', '),
              }));
            } else {
              setFormData(prev => ({ ...prev, street: data.address }));
            }
          }

          // Set existing images
        if (data.photos) {
          setExistingPhotos(data.photos.map(p => ({ id: p.id, url: p.url })));
          setPreviewUrls(data.photos.map(p => p.url));
        }
        // Reset delete list for new property
        setPhotoIdsToDelete([]);
        setSelectedFiles([]);
      } catch (error) {
        console.error('Failed to fetch property:', error);
        toast.error('Failed to load property');
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchProperty();
    }
  }, [propertyId, open]);

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedFiles([]);
    setExistingPhotos([]);
    setPhotoIdsToDelete([]);
    setPreviewUrls([]);
    setNewRule('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Create preview URLs
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const urlToRemove = previewUrls[index];
    
    // Check if this was an existing photo
    const existingPhoto = existingPhotos.find(p => p.url === urlToRemove);
    if (existingPhoto) {
      setPhotoIdsToDelete(prev => [...prev, existingPhoto.id]);
      setExistingPhotos(prev => prev.filter(p => p.id !== existingPhoto.id));
    } else {
      // It was a newly uploaded file
      // We need to find which index in selectedFiles it matches
      // This is a bit tricky since previewUrls is a combined list.
      // previewUrls = [existingUrls..., uploadedUrls...]
      const uploadedIndex = index - existingPhotos.length;
      if (uploadedIndex >= 0) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== uploadedIndex));
      }
    }

    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!formData.title || !formData.rentAmount || !formData.street || !formData.city) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    
    // Get full names for the address string
    const country = Country.getCountryByCode(formData.country);
    const state = State.getStateByCodeAndCountry(formData.state, formData.country);
    const fullAddress = [
      formData.street,
      formData.city,
      state?.name || formData.state,
      country?.name || formData.country,
      formData.postalCode
    ].filter(Boolean).join(', ');
    
    try {
      if (propertyId) {
        // Update existing property
        await propertyApi.updateProperty(propertyId, {
          title: formData.title,
          description: formData.description,
          address: fullAddress,
          rentAmount: parseFloat(formData.rentAmount),
          securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : undefined,
          type: formData.type as 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'ROOM' | 'CONDO' | 'TOWNHOUSE',
          bedrooms: parseInt(formData.bedrooms) || 1,
          bathrooms: parseInt(formData.bathrooms) || 1,
          size: parseInt(formData.size) || 500,
          currency: formData.currency,
          furnished: formData.furnished,
          petFriendly: formData.petFriendly,
          parkingSpaces: parseInt(formData.parkingSpaces) || 0,
          amenities: formData.amenities,
          rules: formData.rules,
          availableFrom: formData.availableFrom || undefined,
          minimumLease: parseInt(formData.minimumLease) || 12,
          photos_to_add: selectedFiles.length > 0 ? selectedFiles : undefined,
          photo_ids_to_delete: photoIdsToDelete.length > 0 ? photoIdsToDelete : undefined,
        });
        toast.success('Property updated successfully');
      } else {
        // Create new property
        await propertyApi.createProperty({
          title: formData.title,
          description: formData.description,
          address: fullAddress,
          rentAmount: parseFloat(formData.rentAmount),
          securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : undefined,
          type: formData.type as 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'ROOM' | 'CONDO' | 'TOWNHOUSE',
          bedrooms: parseInt(formData.bedrooms) || 1,
          bathrooms: parseInt(formData.bathrooms) || 1,
          size: parseInt(formData.size) || 500,
          currency: formData.currency,
          furnished: formData.furnished,
          petFriendly: formData.petFriendly,
          parkingSpaces: parseInt(formData.parkingSpaces) || 0,
          amenities: formData.amenities,
          rules: formData.rules,
          availableFrom: formData.availableFrom || undefined,
          minimumLease: parseInt(formData.minimumLease) || 12,
          files: selectedFiles.length > 0 ? selectedFiles : undefined,
        });
        toast.success('Property created successfully');
      }

      onSave();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to save property:', error);
      toast.error(propertyId ? 'Failed to update property' : 'Failed to create property');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{propertyId ? 'Edit Property' : 'Add New Property'}</DialogTitle>
          <DialogDescription>
            {propertyId ? 'Update your property details' : 'Fill in the details for your new rental property'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Basic Information</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Modern Downtown Apartment"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your property..."
                    rows={3}
                  />
                </div>
                <LocationSelector
                  country={formData.country}
                  state={formData.state}
                  city={formData.city}
                  onCountryChange={(val) => setFormData(prev => ({ ...prev, country: val, state: '', city: '' }))}
                  onStateChange={(val) => setFormData(prev => ({ ...prev, state: val, city: '' }))}
                  onCityChange={(val) => setFormData(prev => ({ ...prev, city: val }))}
                  columnLayout={false}
                  className="md:col-span-2"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="e.g. 700000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                      placeholder="123 Main St"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value.toUpperCase()}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size (sqft)</Label>
                  <Input
                    id="size"
                    type="number"
                    min="0"
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                  <Input
                    id="parkingSpaces"
                    type="number"
                    min="0"
                    value={formData.parkingSpaces}
                    onChange={(e) => setFormData(prev => ({ ...prev, parkingSpaces: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="VND">VND</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="furnished"
                    checked={formData.furnished}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, furnished: checked }))}
                  />
                  <Label htmlFor="furnished">Furnished</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="petFriendly"
                    checked={formData.petFriendly}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, petFriendly: checked }))}
                  />
                  <Label htmlFor="petFriendly">Pet Friendly</Label>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Pricing & Lease</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentAmount">Monthly Rent *</Label>
                  <Input
                    id="rentAmount"
                    type="number"
                    value={formData.rentAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, rentAmount: e.target.value }))}
                    placeholder="2000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">Security Deposit</Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData(prev => ({ ...prev, securityDeposit: e.target.value }))}
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, availableFrom: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumLease">Min Lease (months)</Label>
                  <Input
                    id="minimumLease"
                    type="number"
                    min="1"
                    value={formData.minimumLease}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumLease: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(amenity => (
                  <Badge
                    key={amenity}
                    variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">House Rules</h3>
              <div className="flex gap-2">
                <Input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Add a house rule..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                />
                <Button type="button" variant="outline" onClick={addRule}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.rules.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.rules.map((rule, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {rule}
                      <button onClick={() => removeRule(index)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Property Images</h3>
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-dashed"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
                
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={url}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {previewUrls.length === 0 && (
                  <div className="flex items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    <ImageIcon className="h-8 w-8 mr-2" />
                    <span>No images uploaded yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || isLoading}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {propertyId ? 'Update Property' : 'Add Property'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

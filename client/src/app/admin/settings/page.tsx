'use client';

import { useEffect, useState, FormEvent } from 'react';
import api from '@/lib/api';
import { Settings } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2, Save, Plus, Trash2, GripVertical, KeyRound, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', enabled ? 'bg-brand-yellow' : 'bg-white/20')}>
      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', enabled ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  );
}

interface OpeningHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface HeroTrustBadge {
  label: string;
}

interface DrinkItem {
  name: string;
  description: string;
  servingSize: string;
  price: number;
  icon: string;
}

interface WhyUsFeature {
  icon: string;
  title: string;
  description: string;
}

interface SettingsForm {
  businessName: string;
  tagline: string;
  phones: string[];
  whatsapp: string;
  instagram: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  googleMapsUrl: string;
  openingHours: OpeningHour[];
  grandOpening: {
    enabled: boolean;
    title: string;
    date: string;
    description: string;
    ctaText: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
  hero: {
    isEnabled: boolean;
    locationPill: string;
    headline: string;
    subtitle: string;
    ctaPrimaryLabel: string;
    ctaPrimaryLink: string;
    ctaSecondaryLabel: string;
    ctaSecondaryLink: string;
    trustBadges: HeroTrustBadge[];
    image: string;
    bottomBadgeTitle: string;
    bottomBadgeSubtitle: string;
    ctaBottomLabel: string;
    ctaBottomLink: string;
    floatingBadge: string;
  };
  signatureBites: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaLink: string;
  };
  drinks: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: DrinkItem[];
    ctaLabel: string;
    ctaLink: string;
  };
  whyUs: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    features: WhyUsFeature[];
  };
  brotherhood: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    ctaLabel: string;
    ctaLink: string;
  };
  location: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    embedMapUrl: string;
    directionsUrl: string;
  };
  contactCTA: {
    isEnabled: boolean;
    eyebrow: string;
    title: string;
    description: string;
  };
}

const defaultForm: SettingsForm = {
  businessName: '',
  tagline: '',
  phones: [''],
  whatsapp: '',
  instagram: '',
  address: { street: '', city: '', state: '', country: '', zip: '' },
  googleMapsUrl: '',
  openingHours: [
    { day: 'Sunday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Monday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Tuesday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Wednesday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Thursday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Friday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Saturday', open: '09:00', close: '22:00', isClosed: false },
  ],
  grandOpening: { enabled: false, title: '', date: '', description: '', ctaText: '' },
  socialLinks: { facebook: '', instagram: '', tiktok: '' },
  hero: {
    isEnabled: true,
    locationPill: "Marine Drive • Cox's Bazar",
    headline: 'FRESH BITES. CHILLED SIPS. TRUE BROTHERHOOD.',
    subtitle: 'Savor steamed chicken momos, crunchy yogurt fuchka, golden shrimp fry...',
    ctaPrimaryLabel: 'EXPLORE MENU',
    ctaPrimaryLink: '/menu',
    ctaSecondaryLabel: 'FIND OUR SPOT',
    ctaSecondaryLink: '/location',
    trustBadges: [{ label: 'Made to Order' }, { label: 'Standard Portions' }, { label: 'Beachside Vibe' }],
    image: '/images/hero-platter.jpg',
    bottomBadgeTitle: 'Coastal Beachside Kitchen',
    bottomBadgeSubtitle: 'Open Sun-Thu 3PM-12AM · Fri-Sat 10AM-12AM',
    ctaBottomLabel: 'Order Now',
    ctaBottomLink: '/menu',
    floatingBadge: 'Top Favorites: Momos, Fuchka, Tea',
  },
  signatureBites: {
    isEnabled: true,
    eyebrow: "Chef's Selection",
    title: 'OUR SIGNATURE BITES',
    subtitle: "The crowd favorites that define the Brother's Bites experience.",
    ctaLabel: 'EXPLORE FULL MENU',
    ctaLink: '/menu',
  },
  drinks: {
    isEnabled: true,
    eyebrow: 'Chilled & Warm Sips',
    title: 'REFRESHING DRINKS',
    subtitle: 'All handcrafted drink servings are standardized to 100g for optimal flavor.',
    items: [
      { name: 'Signature Caramel Tea', description: 'Slow-cooked sugar caramel infused with creamy cow milk and rich tea leaves.', servingSize: '100g serving', price: 40, icon: 'CupSoda' },
      { name: 'Creamy Milk Coffee', description: 'Smooth coffee blend brewed with fresh whole milk.', servingSize: '100g serving', price: 50, icon: 'Coffee' },
    ],
    ctaLabel: 'EXPLORE ALL DRINKS',
    ctaLink: '/menu',
  },
  whyUs: {
    isEnabled: true,
    eyebrow: 'The Standard',
    title: "WHY BROTHER'S BITES",
    subtitle: 'Committed to great quality, honest pricing, and genuine coastal vibes.',
    features: [
      { icon: 'Utensils', title: 'Fresh & Honest Flavors', description: 'Every single plate is cooked to order using quality spices, fresh meat, and coastal produce.' },
      { icon: 'MapPin', title: 'Marine Drive Location', description: 'Situated at Sonar Para Beach, enjoy bites right with the ocean breeze and golden sunset.' },
      { icon: 'Users', title: 'Warm Brotherhood', description: 'A welcoming space for friends, families, and travelers.' },
      { icon: 'Sparkles', title: 'Fast & Hygienic', description: 'Spotless preparation standards ensuring fresh, hot, and hygienic food.' },
    ],
  },
  brotherhood: {
    isEnabled: true,
    eyebrow: 'Our Core Spirit',
    title: 'MORE THAN JUST A BITE.',
    titleAccent: "IT'S A BROTHERHOOD.",
    description: "Born from friendship and a love for great street food, Brother's Bites is designed to be a welcoming gathering spot along Marine Drive.",
    ctaLabel: 'READ OUR FULL STORY',
    ctaLink: '/about',
  },
  location: {
    isEnabled: true,
    eyebrow: "Marine Drive, Cox's Bazar",
    title: 'FIND OUR RESTAURANT',
    subtitle: 'Located right by the scenic coastal stretch of Sonar Para Beach.',
    embedMapUrl: '',
    directionsUrl: '',
  },
  contactCTA: {
    isEnabled: true,
    eyebrow: 'Visit Us Today',
    title: 'Ready to Taste The Brotherhood?',
    description: "Marine Drive, Sonar Para Beach, Cox's Bazar. Stop by for fresh food and sea breeze.",
  },
};

type TabId = 'business' | 'hero' | 'signature' | 'drinks' | 'whyus' | 'brotherhood' | 'location' | 'contact' | 'security';

const tabs: { id: TabId; label: string }[] = [
  { id: 'business', label: 'Business Info' },
  { id: 'hero', label: 'Hero Section' },
  { id: 'signature', label: 'Signature Bites' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'whyus', label: 'Why Us' },
  { id: 'brotherhood', label: 'Brotherhood' },
  { id: 'location', label: 'Location' },
  { id: 'contact', label: 'Contact CTA' },
  { id: 'security', label: 'Security & Password' },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('business');

  // Security & Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordUpdating(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password. Please check your current password.',
      });
    } finally {
      setPasswordUpdating(false);
    }
  };

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => {
        const data: Settings = res.data.data || res.data;
        setForm({
          businessName: data.businessName || '',
          tagline: data.tagline || '',
          phones: data.phone?.length ? data.phone : [''],
          whatsapp: data.whatsapp || '',
          instagram: data.instagram || '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            country: data.address?.country || '',
            zip: data.address?.zip || '',
          },
          googleMapsUrl: data.googleMapsUrl || '',
          openingHours: data.openingHours?.length === 7 ? data.openingHours : defaultForm.openingHours,
          grandOpening: {
            enabled: data.grandOpening?.isEnabled || false,
            title: data.grandOpening?.title || '',
            date: data.grandOpening?.date ? new Date(data.grandOpening.date).toISOString().split('T')[0] : '',
            description: data.grandOpening?.description || '',
            ctaText: data.grandOpening?.ctaText || '',
          },
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            instagram: data.socialLinks?.instagram || '',
            tiktok: data.socialLinks?.tiktok || '',
          },
          hero: {
            isEnabled: data.hero?.isEnabled ?? true,
            locationPill: data.hero?.locationPill || defaultForm.hero.locationPill,
            headline: data.hero?.headline || defaultForm.hero.headline,
            subtitle: data.hero?.subtitle || defaultForm.hero.subtitle,
            ctaPrimaryLabel: data.hero?.ctaPrimaryLabel || defaultForm.hero.ctaPrimaryLabel,
            ctaPrimaryLink: data.hero?.ctaPrimaryLink || defaultForm.hero.ctaPrimaryLink,
            ctaSecondaryLabel: data.hero?.ctaSecondaryLabel || defaultForm.hero.ctaSecondaryLabel,
            ctaSecondaryLink: data.hero?.ctaSecondaryLink || defaultForm.hero.ctaSecondaryLink,
            trustBadges: data.hero?.trustBadges?.length ? data.hero.trustBadges : defaultForm.hero.trustBadges,
            image: data.hero?.image || defaultForm.hero.image,
            bottomBadgeTitle: data.hero?.bottomBadgeTitle || defaultForm.hero.bottomBadgeTitle,
            bottomBadgeSubtitle: data.hero?.bottomBadgeSubtitle || defaultForm.hero.bottomBadgeSubtitle,
            ctaBottomLabel: data.hero?.ctaBottomLabel || defaultForm.hero.ctaBottomLabel,
            ctaBottomLink: data.hero?.ctaBottomLink || defaultForm.hero.ctaBottomLink,
            floatingBadge: data.hero?.floatingBadge || defaultForm.hero.floatingBadge,
          },
          signatureBites: {
            isEnabled: data.signatureBites?.isEnabled ?? true,
            eyebrow: data.signatureBites?.eyebrow || defaultForm.signatureBites.eyebrow,
            title: data.signatureBites?.title || defaultForm.signatureBites.title,
            subtitle: data.signatureBites?.subtitle || defaultForm.signatureBites.subtitle,
            ctaLabel: data.signatureBites?.ctaLabel || defaultForm.signatureBites.ctaLabel,
            ctaLink: data.signatureBites?.ctaLink || defaultForm.signatureBites.ctaLink,
          },
          drinks: {
            isEnabled: data.drinks?.isEnabled ?? true,
            eyebrow: data.drinks?.eyebrow || defaultForm.drinks.eyebrow,
            title: data.drinks?.title || defaultForm.drinks.title,
            subtitle: data.drinks?.subtitle || defaultForm.drinks.subtitle,
            items: data.drinks?.items?.length ? data.drinks.items : defaultForm.drinks.items,
            ctaLabel: data.drinks?.ctaLabel || defaultForm.drinks.ctaLabel,
            ctaLink: data.drinks?.ctaLink || defaultForm.drinks.ctaLink,
          },
          whyUs: {
            isEnabled: data.whyUs?.isEnabled ?? true,
            eyebrow: data.whyUs?.eyebrow || defaultForm.whyUs.eyebrow,
            title: data.whyUs?.title || defaultForm.whyUs.title,
            subtitle: data.whyUs?.subtitle || defaultForm.whyUs.subtitle,
            features: data.whyUs?.features?.length ? data.whyUs.features : defaultForm.whyUs.features,
          },
          brotherhood: {
            isEnabled: data.brotherhood?.isEnabled ?? true,
            eyebrow: data.brotherhood?.eyebrow || defaultForm.brotherhood.eyebrow,
            title: data.brotherhood?.title || defaultForm.brotherhood.title,
            titleAccent: data.brotherhood?.titleAccent || defaultForm.brotherhood.titleAccent,
            description: data.brotherhood?.description || defaultForm.brotherhood.description,
            ctaLabel: data.brotherhood?.ctaLabel || defaultForm.brotherhood.ctaLabel,
            ctaLink: data.brotherhood?.ctaLink || defaultForm.brotherhood.ctaLink,
          },
          location: {
            isEnabled: data.location?.isEnabled ?? true,
            eyebrow: data.location?.eyebrow || defaultForm.location.eyebrow,
            title: data.location?.title || defaultForm.location.title,
            subtitle: data.location?.subtitle || defaultForm.location.subtitle,
            embedMapUrl: data.location?.embedMapUrl || defaultForm.location.embedMapUrl,
            directionsUrl: data.location?.directionsUrl || defaultForm.location.directionsUrl,
          },
          contactCTA: {
            isEnabled: data.contactCTA?.isEnabled ?? true,
            eyebrow: data.contactCTA?.eyebrow || defaultForm.contactCTA.eyebrow,
            title: data.contactCTA?.title || defaultForm.contactCTA.title,
            description: data.contactCTA?.description || defaultForm.contactCTA.description,
          },
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        phones: form.phones.filter((p) => p.trim()),
        grandOpening: { ...form.grandOpening, isEnabled: form.grandOpening.enabled },
      };
      await api.patch('/settings', payload);
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (path: string, value: any) => {
    setForm((prev) => {
      const keys = path.split('.');
      const next = JSON.parse(JSON.stringify(prev)) as SettingsForm;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const addPhone = () => setForm((p) => ({ ...p, phones: [...p.phones, ''] }));
  const removePhone = (idx: number) => setForm((p) => ({ ...p, phones: p.phones.filter((_, i) => i !== idx) }));
  const updatePhone = (idx: number, val: string) =>
    setForm((p) => ({ ...p, phones: p.phones.map((ph, i) => (i === idx ? val : ph)) }));

  const updateHour = (idx: number, field: keyof OpeningHour, value: string | boolean) => {
    setForm((p) => ({
      ...p,
      openingHours: p.openingHours.map((h, i) => (i === idx ? { ...h, [field]: value } : h)),
    }));
  };

  const addTrustBadge = () =>
    setForm((p) => ({ ...p, hero: { ...p.hero, trustBadges: [...p.hero.trustBadges, { label: '' }] } }));
  const removeTrustBadge = (idx: number) =>
    setForm((p) => ({ ...p, hero: { ...p.hero, trustBadges: p.hero.trustBadges.filter((_, i) => i !== idx) } }));
  const updateTrustBadge = (idx: number, val: string) =>
    setForm((p) => ({ ...p, hero: { ...p.hero, trustBadges: p.hero.trustBadges.map((b, i) => (i === idx ? { label: val } : b)) } }));

  const addDrink = () =>
    setForm((p) => ({ ...p, drinks: { ...p.drinks, items: [...p.drinks.items, { name: '', description: '', servingSize: '100g serving', price: 0, icon: 'Coffee' }] } }));
  const removeDrink = (idx: number) =>
    setForm((p) => ({ ...p, drinks: { ...p.drinks, items: p.drinks.items.filter((_, i) => i !== idx) } }));
  const updateDrink = (idx: number, field: keyof DrinkItem, value: string | number) =>
    setForm((p) => ({ ...p, drinks: { ...p.drinks, items: p.drinks.items.map((d, i) => (i === idx ? { ...d, [field]: value } : d)) } }));

  const addFeature = () =>
    setForm((p) => ({ ...p, whyUs: { ...p.whyUs, features: [...p.whyUs.features, { icon: 'Sparkles', title: '', description: '' }] } }));
  const removeFeature = (idx: number) =>
    setForm((p) => ({ ...p, whyUs: { ...p.whyUs, features: p.whyUs.features.filter((_, i) => i !== idx) } }));
  const updateFeature = (idx: number, field: keyof WhyUsFeature, value: string) =>
    setForm((p) => ({ ...p, whyUs: { ...p.whyUs, features: p.whyUs.features.map((f, i) => (i === idx ? { ...f, [field]: value } : f)) } }));

  const inputClass = 'w-full bg-brand-surface border border-white/10 rounded-lg px-4 py-2.5 text-brand-cream text-sm placeholder-brand-cream/30 focus:outline-none focus:border-brand-yellow transition-colors';
  const labelClass = 'block text-brand-cream/70 text-sm font-medium mb-2';
  const sectionClass = 'bg-brand-surface-light rounded-xl border border-white/10 p-6';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-yellow" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-cream">Settings</h1>
        <p className="text-brand-cream/50 mt-1">Manage all sections of your website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={cn('rounded-lg px-4 py-3 text-sm',
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400')}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-brand-surface-light rounded-xl border border-white/10 p-1">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id ? 'bg-brand-yellow text-brand-black' : 'text-brand-cream/60 hover:text-brand-cream hover:bg-white/5')}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Business Info Tab */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            <section className={sectionClass}>
              <h2 className="text-brand-cream font-semibold text-lg mb-4">Business Info</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Business Name</label>
                  <input type="text" value={form.businessName} onChange={(e) => updateField('businessName', e.target.value)} className={inputClass} placeholder="Brother's Bites" />
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input type="text" value={form.tagline} onChange={(e) => updateField('tagline', e.target.value)} className={inputClass} placeholder="Your tagline here" />
                </div>
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className="text-brand-cream font-semibold text-lg mb-4">Contact</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Phone Numbers</label>
                  <div className="space-y-2">
                    {form.phones.map((phone, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="tel" value={phone} onChange={(e) => updatePhone(idx, e.target.value)} className={cn(inputClass, 'flex-1')} placeholder="+880..." />
                        {form.phones.length > 1 && (
                          <button type="button" onClick={() => removePhone(idx)} className="p-2 text-brand-cream/50 hover:text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addPhone} className="inline-flex items-center gap-2 text-brand-yellow text-sm hover:underline">
                      <Plus size={14} /> Add phone
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>WhatsApp</label>
                    <input type="text" value={form.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} className={inputClass} placeholder="WhatsApp number" />
                  </div>
                  <div>
                    <label className={labelClass}>Instagram</label>
                    <input type="text" value={form.instagram} onChange={(e) => updateField('instagram', e.target.value)} className={inputClass} placeholder="Instagram handle" />
                  </div>
                </div>
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className="text-brand-cream font-semibold text-lg mb-4">Address</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Street</label>
                  <input type="text" value={form.address.street} onChange={(e) => updateField('address.street', e.target.value)} className={inputClass} placeholder="Street address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" value={form.address.city} onChange={(e) => updateField('address.city', e.target.value)} className={inputClass} placeholder="City" />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input type="text" value={form.address.state} onChange={(e) => updateField('address.state', e.target.value)} className={inputClass} placeholder="State" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Country</label>
                    <input type="text" value={form.address.country} onChange={(e) => updateField('address.country', e.target.value)} className={inputClass} placeholder="Country" />
                  </div>
                  <div>
                    <label className={labelClass}>ZIP</label>
                    <input type="text" value={form.address.zip} onChange={(e) => updateField('address.zip', e.target.value)} className={inputClass} placeholder="ZIP code" />
                  </div>
                </div>
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className="text-brand-cream font-semibold text-lg mb-4">Google Maps URL</h2>
              <input type="url" value={form.googleMapsUrl} onChange={(e) => updateField('googleMapsUrl', e.target.value)} className={inputClass} placeholder="https://maps.google.com/..." />
            </section>

            <section className={sectionClass}>
              <h2 className="text-brand-cream font-semibold text-lg mb-4">Opening Hours</h2>
              <div className="space-y-2">
                {form.openingHours.map((hour, idx) => (
                  <div key={hour.day} className="grid grid-cols-[100px_1fr_1fr_auto_auto] sm:grid-cols-[120px_1fr_1fr_auto] gap-3 items-center">
                    <span className="text-brand-cream/70 text-sm font-medium">{hour.day}</span>
                    <input type="time" value={hour.open} onChange={(e) => updateHour(idx, 'open', e.target.value)} disabled={hour.isClosed} className={cn(inputClass, hour.isClosed && 'opacity-40')} />
                    <input type="time" value={hour.close} onChange={(e) => updateHour(idx, 'close', e.target.value)} disabled={hour.isClosed} className={cn(inputClass, hour.isClosed && 'opacity-40')} />
                    <button type="button" onClick={() => updateHour(idx, 'isClosed', !hour.isClosed)}
                      className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0', hour.isClosed ? 'bg-red-500' : 'bg-green-500')}>
                      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', hour.isClosed ? 'translate-x-1' : 'translate-x-6')} />
                    </button>
                    <span className="text-brand-cream/40 text-xs hidden sm:block">{hour.isClosed ? 'Closed' : 'Open'}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-brand-cream font-semibold text-lg">Grand Opening</h2>
                <Toggle enabled={form.grandOpening.enabled} onToggle={() => updateField('grandOpening.enabled', !form.grandOpening.enabled)} />
              </div>
              {form.grandOpening.enabled && (
                <div className="space-y-4">
                  <div><label className={labelClass}>Title</label><input type="text" value={form.grandOpening.title} onChange={(e) => updateField('grandOpening.title', e.target.value)} className={inputClass} placeholder="Grand Opening" /></div>
                  <div><label className={labelClass}>Date</label><input type="date" value={form.grandOpening.date} onChange={(e) => updateField('grandOpening.date', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Description</label><textarea value={form.grandOpening.description} onChange={(e) => updateField('grandOpening.description', e.target.value)} rows={2} className={cn(inputClass, 'resize-none')} placeholder="Join us for our grand opening..." /></div>
                  <div><label className={labelClass}>CTA Text</label><input type="text" value={form.grandOpening.ctaText} onChange={(e) => updateField('grandOpening.ctaText', e.target.value)} className={inputClass} placeholder="Order Now" /></div>
                </div>
              )}
            </section>

            <section className={sectionClass}>
              <h2 className="text-brand-cream font-semibold text-lg mb-4">Social Links</h2>
              <div className="space-y-4">
                <div><label className={labelClass}>Facebook</label><input type="url" value={form.socialLinks.facebook} onChange={(e) => updateField('socialLinks.facebook', e.target.value)} className={inputClass} placeholder="https://facebook.com/..." /></div>
                <div><label className={labelClass}>Instagram</label><input type="url" value={form.socialLinks.instagram} onChange={(e) => updateField('socialLinks.instagram', e.target.value)} className={inputClass} placeholder="https://instagram.com/..." /></div>
                <div><label className={labelClass}>TikTok</label><input type="url" value={form.socialLinks.tiktok} onChange={(e) => updateField('socialLinks.tiktok', e.target.value)} className={inputClass} placeholder="https://tiktok.com/..." /></div>
              </div>
            </section>
          </div>
        )}

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-brand-cream font-semibold text-lg">Hero Section</h2>
                <Toggle enabled={form.hero.isEnabled} onToggle={() => updateField('hero.isEnabled', !form.hero.isEnabled)} />
              </div>
              {form.hero.isEnabled && (
                <div className="space-y-4">
                  <div><label className={labelClass}>Location Pill Text</label><input type="text" value={form.hero.locationPill} onChange={(e) => updateField('hero.locationPill', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Headline</label><input type="text" value={form.hero.headline} onChange={(e) => updateField('hero.headline', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Subtitle</label><textarea value={form.hero.subtitle} onChange={(e) => updateField('hero.subtitle', e.target.value)} rows={2} className={cn(inputClass, 'resize-none')} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>Primary CTA Label</label><input type="text" value={form.hero.ctaPrimaryLabel} onChange={(e) => updateField('hero.ctaPrimaryLabel', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Primary CTA Link</label><input type="text" value={form.hero.ctaPrimaryLink} onChange={(e) => updateField('hero.ctaPrimaryLink', e.target.value)} className={inputClass} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>Secondary CTA Label</label><input type="text" value={form.hero.ctaSecondaryLabel} onChange={(e) => updateField('hero.ctaSecondaryLabel', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Secondary CTA Link</label><input type="text" value={form.hero.ctaSecondaryLink} onChange={(e) => updateField('hero.ctaSecondaryLink', e.target.value)} className={inputClass} /></div>
                  </div>
                  <div><label className={labelClass}>Hero Image URL</label><input type="text" value={form.hero.image} onChange={(e) => updateField('hero.image', e.target.value)} className={inputClass} placeholder="/images/hero-platter.jpg" /></div>
                </div>
              )}
            </section>

            {form.hero.isEnabled && (
              <section className={sectionClass}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-brand-cream font-semibold text-lg">Trust Badges</h2>
                  <button type="button" onClick={addTrustBadge} className="inline-flex items-center gap-2 text-brand-yellow text-sm hover:underline"><Plus size={14} /> Add</button>
                </div>
                <div className="space-y-2">
                  {form.hero.trustBadges.map((badge, idx) => (
                    <div key={idx} className="flex gap-2">
                      <GripVertical className="w-4 h-4 text-brand-cream/30 mt-2.5 shrink-0" />
                      <input type="text" value={badge.label} onChange={(e) => updateTrustBadge(idx, e.target.value)} className={cn(inputClass, 'flex-1')} placeholder="Badge label" />
                      <button type="button" onClick={() => removeTrustBadge(idx)} className="p-2 text-brand-cream/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {form.hero.isEnabled && (
              <section className={sectionClass}>
                <h2 className="text-brand-cream font-semibold text-lg mb-4">Bottom Badge</h2>
                <div className="space-y-4">
                  <div><label className={labelClass}>Title</label><input type="text" value={form.hero.bottomBadgeTitle} onChange={(e) => updateField('hero.bottomBadgeTitle', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Subtitle</label><input type="text" value={form.hero.bottomBadgeSubtitle} onChange={(e) => updateField('hero.bottomBadgeSubtitle', e.target.value)} className={inputClass} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>CTA Label</label><input type="text" value={form.hero.ctaBottomLabel} onChange={(e) => updateField('hero.ctaBottomLabel', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>CTA Link</label><input type="text" value={form.hero.ctaBottomLink} onChange={(e) => updateField('hero.ctaBottomLink', e.target.value)} className={inputClass} /></div>
                  </div>
                  <div><label className={labelClass}>Floating Badge Text</label><input type="text" value={form.hero.floatingBadge} onChange={(e) => updateField('hero.floatingBadge', e.target.value)} className={inputClass} /></div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Signature Bites Tab */}
        {activeTab === 'signature' && (
          <section className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-brand-cream font-semibold text-lg">Signature Bites Section</h2>
              <Toggle enabled={form.signatureBites.isEnabled} onToggle={() => updateField('signatureBites.isEnabled', !form.signatureBites.isEnabled)} />
            </div>
            {form.signatureBites.isEnabled && (
              <div className="space-y-4">
                <div><label className={labelClass}>Eyebrow</label><input type="text" value={form.signatureBites.eyebrow} onChange={(e) => updateField('signatureBites.eyebrow', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Title</label><input type="text" value={form.signatureBites.title} onChange={(e) => updateField('signatureBites.title', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Subtitle</label><textarea value={form.signatureBites.subtitle} onChange={(e) => updateField('signatureBites.subtitle', e.target.value)} rows={2} className={cn(inputClass, 'resize-none')} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>CTA Label</label><input type="text" value={form.signatureBites.ctaLabel} onChange={(e) => updateField('signatureBites.ctaLabel', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>CTA Link</label><input type="text" value={form.signatureBites.ctaLink} onChange={(e) => updateField('signatureBites.ctaLink', e.target.value)} className={inputClass} /></div>
                </div>
                <p className="text-brand-cream/40 text-xs">Note: The items shown here are auto-fetched from your featured menu items. Mark items as &quot;Featured&quot; in the Menu section to show them here.</p>
              </div>
            )}
          </section>
        )}

        {/* Drinks Tab */}
        {activeTab === 'drinks' && (
          <div className="space-y-6">
            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-brand-cream font-semibold text-lg">Drinks Section</h2>
                <Toggle enabled={form.drinks.isEnabled} onToggle={() => updateField('drinks.isEnabled', !form.drinks.isEnabled)} />
              </div>
              {form.drinks.isEnabled && (
                <div className="space-y-4">
                  <div><label className={labelClass}>Eyebrow</label><input type="text" value={form.drinks.eyebrow} onChange={(e) => updateField('drinks.eyebrow', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Title</label><input type="text" value={form.drinks.title} onChange={(e) => updateField('drinks.title', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Subtitle</label><textarea value={form.drinks.subtitle} onChange={(e) => updateField('drinks.subtitle', e.target.value)} rows={2} className={cn(inputClass, 'resize-none')} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>CTA Label</label><input type="text" value={form.drinks.ctaLabel} onChange={(e) => updateField('drinks.ctaLabel', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>CTA Link</label><input type="text" value={form.drinks.ctaLink} onChange={(e) => updateField('drinks.ctaLink', e.target.value)} className={inputClass} /></div>
                  </div>
                </div>
              )}
            </section>

            {form.drinks.isEnabled && (
              <section className={sectionClass}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-brand-cream font-semibold text-lg">Drink Items</h2>
                  <button type="button" onClick={addDrink} className="inline-flex items-center gap-2 text-brand-yellow text-sm hover:underline"><Plus size={14} /> Add Drink</button>
                </div>
                <div className="space-y-4">
                  {form.drinks.items.map((drink, idx) => (
                    <div key={idx} className="bg-brand-surface rounded-lg border border-white/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-brand-cream/50 text-xs font-medium">Drink #{idx + 1}</span>
                        <button type="button" onClick={() => removeDrink(idx)} className="text-brand-cream/50 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelClass}>Name</label><input type="text" value={drink.name} onChange={(e) => updateDrink(idx, 'name', e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Icon</label>
                          <select value={drink.icon} onChange={(e) => updateDrink(idx, 'icon', e.target.value)} className={inputClass}>
                            <option value="Coffee">Coffee</option>
                            <option value="CupSoda">CupSoda (Tea)</option>
                          </select>
                        </div>
                      </div>
                      <div><label className={labelClass}>Description</label><textarea value={drink.description} onChange={(e) => updateDrink(idx, 'description', e.target.value)} rows={2} className={cn(inputClass, 'resize-none')} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelClass}>Serving Size</label><input type="text" value={drink.servingSize} onChange={(e) => updateDrink(idx, 'servingSize', e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Price (৳)</label><input type="number" value={drink.price} onChange={(e) => updateDrink(idx, 'price', Number(e.target.value))} className={inputClass} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Why Us Tab */}
        {activeTab === 'whyus' && (
          <div className="space-y-6">
            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-brand-cream font-semibold text-lg">Why Us Section</h2>
                <Toggle enabled={form.whyUs.isEnabled} onToggle={() => updateField('whyUs.isEnabled', !form.whyUs.isEnabled)} />
              </div>
              {form.whyUs.isEnabled && (
                <div className="space-y-4">
                  <div><label className={labelClass}>Eyebrow</label><input type="text" value={form.whyUs.eyebrow} onChange={(e) => updateField('whyUs.eyebrow', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Title</label><input type="text" value={form.whyUs.title} onChange={(e) => updateField('whyUs.title', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Subtitle</label><textarea value={form.whyUs.subtitle} onChange={(e) => updateField('whyUs.subtitle', e.target.value)} rows={2} className={cn(inputClass, 'resize-none')} /></div>
                </div>
              )}
            </section>

            {form.whyUs.isEnabled && (
              <section className={sectionClass}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-brand-cream font-semibold text-lg">Feature Cards</h2>
                  <button type="button" onClick={addFeature} className="inline-flex items-center gap-2 text-brand-yellow text-sm hover:underline"><Plus size={14} /> Add Feature</button>
                </div>
                <div className="space-y-4">
                  {form.whyUs.features.map((feature, idx) => (
                    <div key={idx} className="bg-brand-surface rounded-lg border border-white/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-brand-cream/50 text-xs font-medium">Feature #{idx + 1}</span>
                        <button type="button" onClick={() => removeFeature(idx)} className="text-brand-cream/50 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelClass}>Title</label><input type="text" value={feature.title} onChange={(e) => updateFeature(idx, 'title', e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Icon</label>
                          <select value={feature.icon} onChange={(e) => updateFeature(idx, 'icon', e.target.value)} className={inputClass}>
                            <option value="Utensils">Utensils</option>
                            <option value="MapPin">MapPin</option>
                            <option value="Users">Users</option>
                            <option value="Sparkles">Sparkles</option>
                            <option value="Star">Star</option>
                            <option value="Heart">Heart</option>
                            <option value="Shield">Shield</option>
                            <option value="Zap">Zap</option>
                          </select>
                        </div>
                      </div>
                      <div><label className={labelClass}>Description</label><textarea value={feature.description} onChange={(e) => updateFeature(idx, 'description', e.target.value)} rows={2} className={cn(inputClass, 'resize-none')} /></div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Brotherhood Tab */}
        {activeTab === 'brotherhood' && (
          <section className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-brand-cream font-semibold text-lg">Brotherhood Section</h2>
              <Toggle enabled={form.brotherhood.isEnabled} onToggle={() => updateField('brotherhood.isEnabled', !form.brotherhood.isEnabled)} />
            </div>
            {form.brotherhood.isEnabled && (
              <div className="space-y-4">
                <div><label className={labelClass}>Eyebrow</label><input type="text" value={form.brotherhood.eyebrow} onChange={(e) => updateField('brotherhood.eyebrow', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Title (before accent)</label><input type="text" value={form.brotherhood.title} onChange={(e) => updateField('brotherhood.title', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Title Accent (yellow text)</label><input type="text" value={form.brotherhood.titleAccent} onChange={(e) => updateField('brotherhood.titleAccent', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Description</label><textarea value={form.brotherhood.description} onChange={(e) => updateField('brotherhood.description', e.target.value)} rows={3} className={cn(inputClass, 'resize-none')} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>CTA Label</label><input type="text" value={form.brotherhood.ctaLabel} onChange={(e) => updateField('brotherhood.ctaLabel', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>CTA Link</label><input type="text" value={form.brotherhood.ctaLink} onChange={(e) => updateField('brotherhood.ctaLink', e.target.value)} className={inputClass} /></div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <section className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-brand-cream font-semibold text-lg">Location Section</h2>
              <Toggle enabled={form.location.isEnabled} onToggle={() => updateField('location.isEnabled', !form.location.isEnabled)} />
            </div>
            {form.location.isEnabled && (
              <div className="space-y-4">
                <div><label className={labelClass}>Eyebrow</label><input type="text" value={form.location.eyebrow} onChange={(e) => updateField('location.eyebrow', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Title</label><input type="text" value={form.location.title} onChange={(e) => updateField('location.title', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Subtitle</label><input type="text" value={form.location.subtitle} onChange={(e) => updateField('location.subtitle', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Google Maps Embed URL</label><input type="url" value={form.location.embedMapUrl} onChange={(e) => updateField('location.embedMapUrl', e.target.value)} className={inputClass} placeholder="https://maps.google.com/maps?q=...&output=embed" /></div>
                <div><label className={labelClass}>Directions URL</label><input type="url" value={form.location.directionsUrl} onChange={(e) => updateField('location.directionsUrl', e.target.value)} className={inputClass} placeholder="https://share.google/..." /></div>
                <p className="text-brand-cream/40 text-xs">Note: Address, phone, and opening hours are taken from the Business Info tab.</p>
              </div>
            )}
          </section>
        )}

        {/* Contact CTA Tab */}
        {activeTab === 'contact' && (
          <section className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-brand-cream font-semibold text-lg">Contact CTA Section</h2>
              <Toggle enabled={form.contactCTA.isEnabled} onToggle={() => updateField('contactCTA.isEnabled', !form.contactCTA.isEnabled)} />
            </div>
            {form.contactCTA.isEnabled && (
              <div className="space-y-4">
                <div><label className={labelClass}>Eyebrow</label><input type="text" value={form.contactCTA.eyebrow} onChange={(e) => updateField('contactCTA.eyebrow', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Title</label><input type="text" value={form.contactCTA.title} onChange={(e) => updateField('contactCTA.title', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Description</label><textarea value={form.contactCTA.description} onChange={(e) => updateField('contactCTA.description', e.target.value)} rows={2} className={cn(inputClass, 'resize-none')} /></div>
                <p className="text-brand-cream/40 text-xs">Note: Phone, WhatsApp, and Instagram links are taken from Business Info and Social Links tabs.</p>
              </div>
            )}
          </section>
        )}

        {/* Security & Password Tab */}
        {activeTab === 'security' && (
          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-border">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-brand-cream font-bold text-lg">Change Admin Password</h2>
                <p className="text-xs text-brand-cream/60">Update your credentials to keep your restaurant portal safe</p>
              </div>
            </div>

            {passwordMsg && (
              <div
                className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div className="max-w-md space-y-4">
              <div>
                <label className={labelClass}>Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={cn(inputClass, 'pr-10')}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>New Password * (Min. 6 characters)</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={cn(inputClass, 'pr-10')}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Confirm New Password *</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Repeat new password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={passwordUpdating || !currentPassword || !newPassword}
                  className="btn-primary text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {passwordUpdating ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Save Button (for settings tabs) */}
        {activeTab !== 'security' && (
          <div className="flex justify-end pb-8">
            <button type="submit" disabled={saving}
              className="bg-brand-yellow text-brand-black font-semibold px-8 py-3 rounded-lg hover:bg-brand-yellow/90 transition-colors disabled:opacity-50 flex items-center gap-2">
              {saving ? (<><Loader2 className="animate-spin" size={18} /> Saving...</>) : (<><Save size={18} /> Save Settings</>)}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

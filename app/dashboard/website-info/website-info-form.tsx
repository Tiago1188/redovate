'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { BaseWebsiteContent } from '@/lib/content/base-website-content';
import { saveBaseContent } from '@/actions/business/saveBaseContent';
import { generateBaseContent } from '@/actions/ai/generateBaseContent';
import { Loader2, Sparkles, Plus, Trash2 } from 'lucide-react';

// Schema validation
const formSchema = z.object({
    businessName: z.string().min(1, 'Business name is required'),
    tradingName: z.string().optional(),
    tagline: z.string().optional(),
    aboutShort: z.string().optional(),
    aboutFull: z.string().optional(),
    yearFounded: z.coerce.number().optional(),
    industry: z.string().optional(),
    abn: z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    mobile: z.string().optional(),
    email: z.string().email('Invalid email'),
    address: z.string().optional(),
    socialLinks: z.object({
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        linkedin: z.string().optional(),
        youtube: z.string().optional(),
        tiktok: z.string().optional(),
    }).optional(),
    services: z.array(z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        icon: z.string().optional(),
    })).optional(),
    serviceAreas: z.array(z.string()).optional(), // We'll handle this as a comma-separated string in the UI for simplicity or array
    keywords: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface WebsiteInfoFormProps {
    initialData: BaseWebsiteContent;
}

export function WebsiteInfoForm({ initialData }: WebsiteInfoFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            businessName: initialData.businessName || '',
            tradingName: initialData.tradingName || '',
            tagline: initialData.tagline || '',
            aboutShort: initialData.aboutShort || '',
            aboutFull: initialData.aboutFull || '',
            yearFounded: initialData.yearFounded,
            industry: initialData.industry || '',
            abn: initialData.abn || '',
            phone: initialData.phone || '',
            mobile: initialData.mobile || '',
            email: initialData.email || '',
            address: initialData.address || '',
            socialLinks: {
                facebook: initialData.socialLinks?.facebook || '',
                instagram: initialData.socialLinks?.instagram || '',
                linkedin: initialData.socialLinks?.linkedin || '',
                youtube: initialData.socialLinks?.youtube || '',
                tiktok: initialData.socialLinks?.tiktok || '',
            },
            services: initialData.services || [],
            serviceAreas: initialData.serviceAreas || [],
            keywords: initialData.keywords || [],
        } as any,
    });

    const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
        control: form.control,
        name: "services",
    });

    const [isGenerating, setIsGenerating] = useState(false);

    async function handleGenerate() {
        setIsGenerating(true);
        try {
            const result = await generateBaseContent();
            if (result.success && result.data) {
                const data = result.data;
                form.setValue('tagline', data.tagline);
                form.setValue('aboutShort', data.aboutShort);
                form.setValue('aboutFull', data.aboutFull);
                form.setValue('services', data.services);
                form.setValue('serviceAreas', data.serviceAreas);
                form.setValue('keywords', data.keywords);
                toast.success("Content generated successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate content");
        } finally {
            setIsGenerating(false);
        }
    }

    async function onSubmit(data: FormValues) {
        setIsSaving(true);
        try {
            await saveBaseContent(data);
            toast.success('Website information saved successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save information');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Website Information</h2>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleGenerate} disabled={isGenerating || isSaving}>
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Generate with AI
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="identity" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
                        <TabsTrigger value="identity">Identity</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>

                    <TabsContent value="identity" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Business Identity</CardTitle>
                                <CardDescription>
                                    Core information about your business that appears across your website.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="businessName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Business Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Acme Corp" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tradingName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Trading Name (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Acme Services" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="tagline"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tagline / Slogan</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Excellence in every job" {...field} />
                                            </FormControl>
                                            <FormDescription>A short, catchy phrase describing your business.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="industry"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Industry</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Plumbing, Electrical, etc." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="yearFounded"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year Founded</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="2020" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="aboutShort"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief overview of your business (used in footers, meta descriptions)"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="aboutFull"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full About Us</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Detailed story of your business, mission, and values."
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Services & Areas</CardTitle>
                                <CardDescription>
                                    Define what you do and where you do it.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-base">Services</FormLabel>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => appendService({ title: "", description: "" })}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Service
                                        </Button>
                                    </div>

                                    {serviceFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg bg-muted/20">
                                            <div className="grid gap-4 flex-1">
                                                <FormField
                                                    control={form.control}
                                                    name={`services.${index}.title`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Service Name (e.g. House Cleaning)" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`services.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Brief description of this service..."
                                                                    className="h-20 resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive/90"
                                                onClick={() => removeService(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {serviceFields.length === 0 && (
                                        <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                                            No services added yet. Add your key services here.
                                        </div>
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name="serviceAreas"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service Areas</FormLabel>
                                            <FormControl>
                                                {/* Simple comma-separated input for now, could be tag input later */}
                                                <Textarea
                                                    placeholder="Sydney, North Sydney, Parramatta, etc. (Comma separated)"
                                                    className="resize-none"
                                                    {...field}
                                                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        field.onChange(val.split(",").map(s => s.trim()).filter(Boolean));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>List the suburbs or regions you serve.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>
                                    How customers can reach you.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="contact@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="(02) 1234 5678" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mobile Number (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="0400 000 000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="abn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ABN (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="12 345 678 901" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Physical Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main St, Sydney NSW 2000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media</CardTitle>
                                <CardDescription>
                                    Links to your social media profiles.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="socialLinks.facebook"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Facebook URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://facebook.com/yourpage" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="socialLinks.instagram"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Instagram URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://instagram.com/yourprofile" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="socialLinks.linkedin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>LinkedIn URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://linkedin.com/company/yourcompany" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="socialLinks.youtube"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>YouTube URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://youtube.com/@yourchannel" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Settings</CardTitle>
                                <CardDescription>
                                    Keywords to help customers find you.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Keywords</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="plumber sydney, emergency plumbing, blocked drains (Comma separated)"
                                                    className="resize-none"
                                                    {...field}
                                                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        field.onChange(val.split(",").map(s => s.trim()).filter(Boolean));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>Enter keywords separated by commas.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    );
}

'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DomainHelpDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DomainHelpDialog({ open, onOpenChange }: DomainHelpDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>How to Connect Your Domain</DialogTitle>
                    <DialogDescription>
                        Follow these steps to configure your DNS settings with your domain provider.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="godaddy">GoDaddy</TabsTrigger>
                        <TabsTrigger value="namecheap">Namecheap</TabsTrigger>
                        <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[400px] mt-4 pr-4">
                        <TabsContent value="general" className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium">1. Add a TXT Record (Verification)</h3>
                                <p className="text-sm text-muted-foreground">
                                    This proves you own the domain. It does not affect your website traffic.
                                </p>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                    <li><strong>Type:</strong> TXT</li>
                                    <li><strong>Host/Name:</strong> _redovate</li>
                                    <li><strong>Value:</strong> (Copy the token from the dashboard)</li>
                                    <li><strong>TTL:</strong> Default or 3600</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">2. Add an A Record (Root Domain)</h3>
                                <p className="text-sm text-muted-foreground">
                                    This points your domain (e.g., example.com) to our servers.
                                </p>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                    <li><strong>Type:</strong> A</li>
                                    <li><strong>Host/Name:</strong> @</li>
                                    <li><strong>Value:</strong> 76.76.21.21</li>
                                    <li><strong>TTL:</strong> Default or 3600</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">3. Add a CNAME Record (Subdomain)</h3>
                                <p className="text-sm text-muted-foreground">
                                    If using a subdomain (e.g., www.example.com or blog.example.com).
                                </p>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                    <li><strong>Type:</strong> CNAME</li>
                                    <li><strong>Host/Name:</strong> www (or your subdomain)</li>
                                    <li><strong>Value:</strong> cname.vercel-dns.com</li>
                                    <li><strong>TTL:</strong> Default or 3600</li>
                                </ul>
                            </div>
                        </TabsContent>

                        <TabsContent value="godaddy" className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium">GoDaddy Setup</h3>
                                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-2">
                                    <li>Log in to your GoDaddy Domain Portfolio.</li>
                                    <li>Select your domain to access the <strong>Domain Settings</strong> page.</li>
                                    <li>Select <strong>DNS</strong> to view your records.</li>
                                    <li>Select <strong>Add New Record</strong>.</li>
                                    <li>
                                        <strong>For Verification:</strong> Choose <strong>TXT</strong>. Set Name to <code>_redovate</code> and Value to your token.
                                    </li>
                                    <li>
                                        <strong>For Root Domain:</strong> Choose <strong>A</strong>. Set Name to <code>@</code> and Value to <code>76.76.21.21</code>.
                                    </li>
                                    <li>Select <strong>Save</strong>.</li>
                                </ol>
                            </div>
                        </TabsContent>

                        <TabsContent value="namecheap" className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium">Namecheap Setup</h3>
                                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-2">
                                    <li>Sign in to your Namecheap account and go to the <strong>Domain List</strong>.</li>
                                    <li>Click <strong>Manage</strong> next to your domain.</li>
                                    <li>Navigate to the <strong>Advanced DNS</strong> tab.</li>
                                    <li>Click <strong>Add New Record</strong>.</li>
                                    <li>
                                        <strong>For Verification:</strong> Select <strong>TXT Record</strong>. Host: <code>_redovate</code>, Value: your token.
                                    </li>
                                    <li>
                                        <strong>For Root Domain:</strong> Select <strong>A Record</strong>. Host: <code>@</code>, Value: <code>76.76.21.21</code>.
                                    </li>
                                    <li>Click the checkmark to save changes.</li>
                                </ol>
                            </div>
                        </TabsContent>

                        <TabsContent value="cloudflare" className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium">Cloudflare Setup</h3>
                                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-2">
                                    <li>Log in to the Cloudflare dashboard and select your account and domain.</li>
                                    <li>Go to <strong>DNS</strong> {'>'} <strong>Records</strong>.</li>
                                    <li>Click <strong>Add record</strong>.</li>
                                    <li>
                                        <strong>For Verification:</strong> Type: <strong>TXT</strong>. Name: <code>_redovate</code>. Content: your token.
                                    </li>
                                    <li>
                                        <strong>For Root Domain:</strong> Type: <strong>A</strong>. Name: <code>@</code>. IPv4 address: <code>76.76.21.21</code>.
                                    </li>
                                    <li>Ensure <strong>Proxy status</strong> is set to <strong>DNS Only</strong> (Grey cloud) for verification records.</li>
                                    <li>Click <strong>Save</strong>.</li>
                                </ol>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

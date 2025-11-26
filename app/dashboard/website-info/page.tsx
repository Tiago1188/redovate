import { getBaseContent } from '@/actions/business/getBaseContent';
import { WebsiteInfoForm } from './website-info-form';

export default async function WebsiteInfoPage() {
    const baseContent = await getBaseContent();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <WebsiteInfoForm initialData={baseContent} />
        </div>
    );
}

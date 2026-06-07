import UploadCenter from "@/components/upload/UploadCenter";
import PageHeader from "@/components/shared/PageHeader";

export default function UploadPage() {
  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      <PageHeader
        label="Upload"
        title="Upload your relationship data"
        sub="AI analyses everything privately to understand your patterns. All data is end-to-end encrypted."
      />
      <UploadCenter />
    </div>
  );
}

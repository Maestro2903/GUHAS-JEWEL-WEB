import PageHeader from "@/components/PageHeader";
import ReviewForm from "@/components/ReviewForm";

export default function NewReviewPage() {
  return (
    <div>
      <PageHeader title="Add review" subtitle="Add a customer testimonial." />
      <ReviewForm />
    </div>
  );
}

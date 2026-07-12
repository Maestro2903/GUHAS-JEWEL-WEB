import PageBanner from "@/components/PageBanner";
import ContactForm from "@/components/ContactForm";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
} from "@/components/Icons";

export const metadata = {
  title: "Contact — GUHAS GEMS AND JEWELLERIES",
  description:
    "Visit the Guhas Gems and Jewelleries showroom in Karur, Tamil Nadu, or send us a message to book a private viewing.",
};

const details = [
  {
    icon: MapPinIcon,
    title: "Visit Us",
    lines: [
      "No. 06, Thiru. V. Ka. Road",
      "Landmark: P.T. Bus Service",
      "Karur, Tamil Nadu 639001",
    ],
  },
  {
    icon: PhoneIcon,
    title: "Call Us",
    lines: ["+91 79040 21379"],
  },
  {
    icon: MailIcon,
    title: "Email Us",
    lines: ["guhasjewellery1978@gmail.com"],
  },
  {
    icon: ClockIcon,
    title: "Opening Hours",
    lines: ["Mon – Sat: 10am – 8pm", "Sunday: by appointment"],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageBanner
        title="Get in Touch"
        subtitle="Book a private viewing or ask us anything — we'd love to hear from you."
      />

      <section className="container-x grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        {/* Details */}
        <div>
          <h2 className="font-serif text-3xl text-ink">Our Atelier</h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            Step inside our Karur showroom to explore the collection in person
            or discuss a custom commission with our designers.
          </p>
          <div className="mt-8 grid gap-7 sm:grid-cols-2">
            {details.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-4">
                <Icon className="h-7 w-7 shrink-0 text-burgundy" />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
                    {title}
                  </h3>
                  {lines.map((line) => (
                    <p key={line} className="mt-1 text-sm text-muted">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-lg border border-black/5 bg-white p-7 shadow-sm lg:p-9">
          <h2 className="font-serif text-2xl text-ink">Send a Message</h2>
          <p className="mt-2 text-sm text-muted">
            Fill in the form and we will get back to you within one business day.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

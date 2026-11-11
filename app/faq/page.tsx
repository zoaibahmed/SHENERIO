import type { Metadata } from 'next';
import { CareArrow, CarePage } from '@/components/care-page';
import { faqGroups } from '@/lib/customer-care';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Explore answers about SHENERIO, LUMICLEAR, the daily ritual and customer care.',
};

export default function FaqPage() {
  return (
    <CarePage label="Customer care" title="Frequently Asked Questions" intro="Explore the House, the LUMICLEAR collection and how the two products fit into your routine.">
      <div className="care-faq">
        <nav className="care-faq-index" aria-label="Question categories">
          <ul className="care-link-list">
            {faqGroups.map(group => (
              <li key={group.id}><a href={`#${group.id}`}>{group.title}<CareArrow /></a></li>
            ))}
          </ul>
        </nav>
        <div className="care-faq-groups">
          {faqGroups.map(group => (
            <section className="care-faq-group" id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}>
              <h2 id={`${group.id}-title`}>{group.title}</h2>
              {group.items.map(item => (
                <details key={item.id}>
                  <summary>
                    <span>{item.question}</span>
                    <span className="care-disclosure-mark" aria-hidden="true" />
                  </summary>
                  <div className="care-faq-answer" id={item.id}>
                    {item.previewNote && <p className="care-notice">{item.previewNote}</p>}
                    <p>{item.answer}</p>
                    {item.link && <a className="text-link" href={item.link.href}>{item.link.label}<CareArrow /></a>}
                  </div>
                </details>
              ))}
            </section>
          ))}
          <div className="care-faq-contact">
            <p>Looking for something else?</p>
            <a className="text-link" href="/contact">Contact SHENERIO <CareArrow /></a>
          </div>
        </div>
      </div>
    </CarePage>
  );
}

/**
 * Immigration advice is regulated in the UK: giving it without OISC
 * authorisation (or an exemption, e.g. solicitors) is a criminal offence under
 * the Immigration and Asylum Act 1999. Everything in this section is therefore
 * signposting to official sources, and this notice has to appear wherever that
 * content is shown so nobody mistakes it for advice.
 */
export function AdviceDisclaimer() {
  return (
    <div className="rounded-lg border border-brand-crimson/30 bg-brand-crimson/5 p-4">
      <p className="text-sm font-semibold text-foreground">
        This is information, not immigration advice
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        We point you to official sources so you can find things quickly. We are not
        immigration advisers and nothing here is legal advice. For advice on your own
        situation, speak to a solicitor or an adviser regulated by the{" "}
        <a
          href="https://www.gov.uk/find-an-immigration-adviser"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4"
        >
          OISC
        </a>
        . Always check{" "}
        <a
          href="https://www.gov.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4"
        >
          GOV.UK
        </a>{" "}
        for the current rules — they change often, and this page may not be up to date.
      </p>
    </div>
  );
}

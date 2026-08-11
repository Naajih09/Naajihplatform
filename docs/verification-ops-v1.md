# Verification Operations v1

## Manual Today

- Final approval/rejection is still performed by an admin reviewer.
- Manual document uploads are reviewed in the admin verification queue.
- Provider sessions can create/refresh requests, but failed or mismatched results still route to human review.
- Investor "featured" and "founding investor" labels are admin-curated through the investor profile fields.

## Automated Before Human Review

- Required profile checks flag missing names, business name, CAC number for business checks, and unverified email.
- Document URL checks flag missing or unsupported document file extensions.
- Duplicate-account screening flags matching email/company-name candidates.
- Flagged requests enter the same queue with `FLAGGED` status and risk flags for reviewer prioritization.

## SLA

- Target turnaround: `VERIFICATION_SLA_HOURS`, default `48` hours.
- Admin queue metrics expose backlog size, flagged backlog, average time to verify, and SLA target.

## Cohort 1 Deferred

- OCR/document-expiry extraction from uploaded files.
- Full fuzzy matching beyond exact email/company checks.
- Public trust-score weighting from connection feedback.
- Provider-specific KYC/KYB evidence normalization for each vendor.

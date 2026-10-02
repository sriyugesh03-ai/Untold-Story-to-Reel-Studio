import type { PIISanitizationResult } from '../types';

export function sanitizePII(rawText: string): PIISanitizationResult {
  const detectedItems: PIISanitizationResult['detectedItems'] = [];
  let cleanedText = rawText;

  // Phone regex
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}|\b\d{10}\b/g;
  const phones = rawText.match(phoneRegex);
  if (phones) {
    phones.forEach((p) => {
      if (p.trim().length >= 7) {
        detectedItems.push({
          type: 'phone',
          value: p.trim(),
          replacement: '[REDACTED_PHONE]',
        });
        cleanedText = cleanedText.replace(p, '[REDACTED_PHONE]');
      }
    });
  }

  // Email regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  const emails = rawText.match(emailRegex);
  if (emails) {
    emails.forEach((e) => {
      detectedItems.push({
        type: 'email',
        value: e.trim(),
        replacement: '[REDACTED_EMAIL]',
      });
      cleanedText = cleanedText.replace(e, '[REDACTED_EMAIL]');
    });
  }

  // Street / Address patterns
  const addressRegex = /\b\d{1,5}\s+[A-Za-z0-9\s.,]+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Apartment|Apt|Flat|Pin\s*code\s*\d{6})\b/gi;
  const addresses = rawText.match(addressRegex);
  if (addresses) {
    addresses.forEach((a) => {
      detectedItems.push({
        type: 'address',
        value: a.trim(),
        replacement: '[REDACTED_LOCATION]',
      });
      cleanedText = cleanedText.replace(a, '[REDACTED_LOCATION]');
    });
  }

  return {
    hasPII: detectedItems.length > 0,
    cleanedText,
    detectedItems,
  };
}

export function parseInstagramDM(rawInput: string): {
  handle: string;
  storyContent: string;
  category: string;
  isAnonymous: boolean;
  detectedConsent: boolean;
  doNotMention: string;
} {
  let handle = '';
  let isAnonymous = false;
  let detectedConsent = false;
  let doNotMention = '';
  const storyContent = rawInput;

  // Check handle pattern @username
  const handleMatch = rawInput.match(/@([A-Za-z0-9_.]+)/);
  if (handleMatch) {
    handle = `@${handleMatch[1]}`;
  }

  // Check anonymous keywords
  if (
    rawInput.toLowerCase().includes('keep me anonymous') ||
    rawInput.toLowerCase().includes('dont reveal my name') ||
    rawInput.toLowerCase().includes("don't share my name") ||
    rawInput.toLowerCase().includes('hide my name') ||
    rawInput.toLowerCase().includes('anonymous please')
  ) {
    isAnonymous = true;
  }

  // Check consent keywords
  if (
    rawInput.toLowerCase().includes('you can share') ||
    rawInput.toLowerCase().includes('i agree') ||
    rawInput.toLowerCase().includes('feel free to make a reel') ||
    rawInput.toLowerCase().includes('you can make a video') ||
    rawInput.toLowerCase().includes('share this story') ||
    rawInput.toLowerCase().includes('i give permission')
  ) {
    detectedConsent = true;
  }

  // Detect "do not mention"
  const doNotMentionMatch = rawInput.match(/(?:do not mention|don't mention|leave out|skip the part about)\s*[:\-\s]*(.+?)(?:\.|\n|$)/i);
  if (doNotMentionMatch) {
    doNotMention = doNotMentionMatch[1].trim();
  }

  return {
    handle: handle || (isAnonymous ? 'Anonymous Follower' : '@instagram_user'),
    storyContent: storyContent.trim(),
    category: 'Heartbreak & Betrayal',
    isAnonymous,
    detectedConsent,
    doNotMention,
  };
}

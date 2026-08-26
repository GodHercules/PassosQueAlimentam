import { describe, expect, it } from 'vitest';
import { ageAtEvent, registrationSchema } from '../../src/lib/validation';
describe('registration rules',()=>{it('requires referrer only for referral',()=>{expect(registrationSchema.safeParse({referralSource:'REFERRAL',shirtSize:'M'}).success).toBe(false);expect(registrationSchema.safeParse({referralSource:'MF_PARTNERS',shirtSize:'M'}).success).toBe(true)});it('calculates age at event',()=>{expect(ageAtEvent('2008-11-29')).toBe(17);expect(ageAtEvent('2008-11-28')).toBe(18)})});

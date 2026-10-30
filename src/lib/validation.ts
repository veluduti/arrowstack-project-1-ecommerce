import { z } from 'zod';

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(60, { message: 'Full name cannot exceed 60 characters.' })
    .regex(/^[a-zA-Z\s.]+$/, {
      message: 'Full name should only contain letters, spaces, and periods.',
    }),

  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email address (e.g., alex@example.com).' }),

  phone: z
    .string()
    .trim()
    .min(1, { message: 'Phone number is required.' })
    .regex(/^[6-9]\d{9}$/, {
      message: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.',
    }),

  address: z
    .string()
    .trim()
    .min(5, { message: 'Street address must be at least 5 characters.' })
    .max(120, { message: 'Address cannot exceed 120 characters.' }),

  city: z
    .string()
    .trim()
    .min(2, { message: 'City must be at least 2 characters.' })
    .max(50, { message: 'City cannot exceed 50 characters.' }),

  state: z
    .string()
    .trim()
    .min(2, { message: 'Please specify your state/province.' })
    .max(50, { message: 'State cannot exceed 50 characters.' }),

  postalCode: z
    .string()
    .trim()
    .min(1, { message: 'Postal code is required.' })
    .regex(/^\d{6}$/, {
      message: 'Please enter a valid 6-digit postal PIN code (e.g., 500081).',
    }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

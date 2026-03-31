import { prisma } from '@/lib/prisma'
import { TestimonialsManager } from './TestimonialsManager'

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return <TestimonialsManager initialTestimonials={testimonials} />
}

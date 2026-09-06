import Link from 'next/link'

export default function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex justify-between items-center mb-5 pb-3 border-b-2 border-primary">
      <h2 className="text-sm font-extrabold uppercase tracking-wide">{title}</h2>
      {href && (
        <Link href={href} className="text-xs text-primary font-semibold hover:underline">
          View All &rarr;
        </Link>
      )}
    </div>
  )
}
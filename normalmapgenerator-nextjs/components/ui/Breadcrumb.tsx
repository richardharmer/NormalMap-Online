import Link from 'next/link';

export default function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
    return (
        <nav className="flex text-sm text-zinc-400 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <span className="text-zinc-600">/</span>
                        {item.href ? (
                            <Link href={item.href} className="hover:text-cyan-400 transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-zinc-200 font-medium">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

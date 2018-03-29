import React from 'react';
import Link from 'next/link';

export default () => (
    <ul>
        <li><Link href="/b" as="/a">a</Link></li>
        <li><Link href="/a" as="/b">b</Link></li>
        <li>
            <Link href={{ pathname: '/posts', query: { id: '2' } }} as="/posts/2">
                post #2
            </Link>
        </li>
    </ul>
);

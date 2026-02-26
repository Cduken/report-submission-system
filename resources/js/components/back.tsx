// import type { UrlMethodPair } from '@inertiajs/core';
// import { Link } from '@inertiajs/react';
// import { ArrowLeftIcon } from 'lucide-react';

// interface Props {
//     link: UrlMethodPair | string;
// }
// export default function Back({ link }: Props) {
//     return (
//         <Link href={link}>
//             <div className="flex items-center gap-1">
//                 <ArrowLeftIcon size={20} />
//                 <span> Back</span>
//             </div>
//         </Link>
//     );
// }

import { router } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';

export default function Back() {
    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/dashboard'); // fallback
        }
    };

    return (
        <button
            onClick={handleBack}
            className="flex cursor-pointer items-center gap-1"
        >
            <ArrowLeftIcon size={20} />
            <span>Back</span>
        </button>
    );
}

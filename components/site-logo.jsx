import { Link } from 'react-router-dom';

export default function SiteLogo() {
    return (
        <div className="text-nowrap flex items-center p-0 hover:bg-transparent focus:ring-0 h-auto">
            <Link to="/" >
                <img src="/images/favicon.svg" alt="Lemon Site Logo" className="size-12" />
            </Link>
            <Link to="/" className='text-left ml-1'>
                <h4 className="scroll-m-20 text-xl font-bold tracking-tight text-black">柠檬短剧</h4>
                <small className="text-sm leading-none font-light text-black/80">发现·不一样的精彩</small>
            </Link>
        </div>
    );
}   
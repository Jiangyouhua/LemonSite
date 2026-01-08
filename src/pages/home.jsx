import HomeAd from "@/components/home-ad";
import HomeDrama from "@/components/home-drama";
import HomeFooter from "@/components/home-footer";
import { HomeHeader } from "@/components/home-header";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="bg-[url(/images/home-back.svg)] bg-no-repeat bg-contain flex flex-col justify-center items-center text-white text-center max-w-full">
      <HomeHeader />
      <HomeAd />
      <div className="justify-center my-8">
        <HomeDrama />
      </div>
      <Separator className="my-4 border-white/30 w-1/2" />
      <HomeFooter />
    </div>
  );
}
import SelectOne from "@/components/SelectOne";
import Head from "next/head";
import Link from "next/link";

const subscribe = () => {
  const FormNumb = ["1", "2", "3"];

  return (
    <div>
      <Head>
        <title>Update payment method - NetPay Upadate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="border-b border-white/10 bg-[#141414]">
        <Link href={"/"}>
          <img
            src="/logo.svg"
            alt="Logo"
            width={150}
            height={90}
            className="cursor-pointer object-contain"
          />
        </Link>
      </header>
      <SelectOne />
    </div>
  );
};

export default subscribe;

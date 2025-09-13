import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <section className='flex justify-center items-center h-[80vh]'>
            <SignIn />
        </section>
    )
}
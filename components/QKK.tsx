import Image from "next/image"
import React from 'react'

const QKK = ({ answer }: { answer: any }) => {


    return (
        <div className="flex flex-col gap-2 p-2">
            <Image src="/QKK_Redesign_Circles_Final_Frei 2.png" width={500} height={250} alt="QKK Modell" className="mx-auto my-2" />
            <div className="text-center">
                {answer}
            </div>
        </div>
    )
}

export default QKK
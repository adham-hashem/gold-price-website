import type { Metadata } from "next";
import ConverterClient from "./ConverterClient";

export const metadata: Metadata = {
    title: "تحويل بين عيارات الذهب - أسعار الذهب مصر",
    description: "حوّل بين عيارات الذهب المختلفة (24، 22، 21، 18، 14) بسهولة. اعرف الفرق في الوزن والقيمة بين العيارات المختلفة.",
    keywords: ["تحويل عيارات الذهب", "تحويل ذهب", "عيار 21 لـ 18", "حاسبة عيارات الذهب"],
    openGraph: {
        title: "تحويل بين عيارات الذهب - أسعار الذهب مصر",
        description: "حوّل بين عيارات الذهب المختلفة واعرف الفرق في الوزن والقيمة",
    },
};

export default function ConverterPage() {
    return <ConverterClient />;
}

import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
    title: "حاسبة سعر الذهب والمصنعية - أسعار الذهب مصر",
    description: "احسب سعر الذهب مع المصنعية لجميع العيارات. حاسبة دقيقة تعتمد على أسعار الذهب المحدثة لحظة بلحظة في مصر.",
    keywords: ["حاسبة الذهب", "مصنعية الذهب", "سعر جرام الذهب", "حاسبة سعر الذهب مصر"],
    openGraph: {
        title: "حاسبة سعر الذهب والمصنعية - أسعار الذهب مصر",
        description: "احسب سعر الذهب مع المصنعية لجميع العيارات في مصر",
    },
};

export default function CalculatorPage() {
    return <CalculatorClient />;
}

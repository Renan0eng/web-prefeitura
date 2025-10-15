import { Radio } from "lucide-react"

interface QuestionCardProps {
  question: {
    id: string
    title: string
    options: string[]
  }
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-purple-500">
      <input
        className="font-medium w-full border-none focus:outline-none text-gray-800"
        value={question.title}
        onChange={() => {}}
      />
      <div className="mt-3 space-y-2">
        {question.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <Radio className="text-gray-500" size={18} />
            <input
              className="border-none focus:outline-none w-full text-gray-700"
              value={opt}
              onChange={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

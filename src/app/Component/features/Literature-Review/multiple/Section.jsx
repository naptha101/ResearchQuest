export const Section = ({ title, children }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-sans tracking-tight border-b pb-2 border-gray-200">
        {title}
      </h2>
      <div className="text-base sm:text-[1.15rem] text-gray-800">
        {children}
      </div>
    </section>
  )
}
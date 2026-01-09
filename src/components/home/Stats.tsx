export function Stats() {
  const stats = [
    { value: '20+', label: 'Active Properties' },
    { value: '5+', label: 'Happy Tenants' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <section className="py-12 border-y bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

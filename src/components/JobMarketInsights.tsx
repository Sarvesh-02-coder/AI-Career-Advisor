import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MapPin, DollarSign, Users, Briefcase } from "lucide-react";

export function JobMarketInsights() {
  // Mock job market data
  const skillDemandData = [
    { skill: 'React', demand: 95, growth: '+18%' },
    { skill: 'Python', demand: 92, growth: '+25%' },
    { skill: 'JavaScript', demand: 89, growth: '+12%' },
    { skill: 'AWS', demand: 87, growth: '+22%' },
    { skill: 'Node.js', demand: 82, growth: '+15%' },
    { skill: 'SQL', demand: 78, growth: '+8%' },
    { skill: 'Docker', demand: 75, growth: '+28%' },
    { skill: 'TypeScript', demand: 71, growth: '+35%' }
  ];

  const jobTrendsData = [
    { role: 'AI/ML Engineer', openings: 2450, avgSalary: 145000 },
    { role: 'Frontend Developer', openings: 3200, avgSalary: 95000 },
    { role: 'DevOps Engineer', openings: 1800, avgSalary: 115000 },
    { role: 'Data Scientist', openings: 1600, avgSalary: 125000 },
    { role: 'Full Stack Developer', openings: 2800, avgSalary: 105000 },
    { role: 'Product Manager', openings: 950, avgSalary: 135000 }
  ];

  const locationData = [
    { location: 'San Francisco', jobs: 4200, avgSalary: 145000, color: '#8B5CF6' },
    { location: 'New York', jobs: 3800, avgSalary: 125000, color: '#A855F7' },
    { location: 'Seattle', jobs: 2900, avgSalary: 135000, color: '#C084FC' },
    { location: 'Austin', jobs: 2100, avgSalary: 105000, color: '#DDD6FE' },
    { location: 'Remote', jobs: 5600, avgSalary: 115000, color: '#F3E8FF' }
  ];

  const industryGrowthData = [
    { name: 'AI/Machine Learning', growth: 45 },
    { name: 'Cloud Computing', growth: 32 },
    { name: 'Cybersecurity', growth: 28 },
    { name: 'Mobile Development', growth: 22 },
    { name: 'Web Development', growth: 18 },
    { name: 'Data Analytics', growth: 35 }
  ];

  const COLORS = ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Skill Demand Chart */}
      <Card className="bg-gradient-soft shadow-card border-0 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>In-Demand Skills & Growth Rates</span>
          </CardTitle>
          <CardDescription>
            Skills with highest market demand and projected growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillDemandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="skill" 
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  `${value}% demand`,
                  'Market Demand'
                ]}
                labelFormatter={(label) => `Skill: ${label}`}
              />
              <Bar 
                dataKey="demand" 
                fill="url(#skillGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#C084FC" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {skillDemandData.slice(0, 4).map((skill) => (
              <div key={skill.skill} className="bg-white/50 p-3 rounded-lg text-center">
                <div className="font-semibold text-sm">{skill.skill}</div>
                <div className="text-xs text-muted-foreground">{skill.growth} growth</div>
                <Progress value={skill.demand} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Trends */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span>Trending Job Roles</span>
          </CardTitle>
          <CardDescription>
            Most in-demand positions and average salaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobTrendsData.map((job, index) => (
              <div key={job.role} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-sm">{job.role}</h4>
                  <p className="text-xs text-muted-foreground">{job.openings.toLocaleString()} openings</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    ${(job.avgSalary / 1000).toFixed(0)}k
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Distribution */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span>Top Locations</span>
          </CardTitle>
          <CardDescription>
            Job distribution by location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="jobs"
                label={({ location, jobs }: any) => `${location}: ${jobs}`}
                labelLine={false}
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} jobs`, 'Available Positions']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {locationData.map((location) => (
              <div key={location.location} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: location.color }}
                  ></div>
                  <span>{location.location}</span>
                </div>
                <span className="text-muted-foreground">
                  ${(location.avgSalary / 1000).toFixed(0)}k avg
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Growth */}
      <Card className="bg-gradient-soft shadow-card border-0 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span>Industry Growth Forecast</span>
          </CardTitle>
          <CardDescription>
            Expected growth rates by industry sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industryGrowthData.map((industry, index) => (
              <div key={industry.name} className="bg-white/50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">{industry.name}</h4>
                <div className="flex items-center space-x-2">
                  <Progress value={industry.growth} className="flex-1 h-2" />
                  <span className="text-sm font-medium text-primary">
                    +{industry.growth}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Expected growth next 2 years
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Summary */}
      <Card className="bg-gradient-primary text-primary-foreground shadow-card border-0 lg:col-span-2">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">156k+</div>
              <div className="text-sm opacity-90">Active Job Postings</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$118k</div>
              <div className="text-sm opacity-90">Average Tech Salary</div>
            </div>
            <div>
              <div className="text-2xl font-bold">+24%</div>
              <div className="text-sm opacity-90">Industry Growth</div>
            </div>
            <div>
              <div className="text-2xl font-bold">89%</div>
              <div className="text-sm opacity-90">Remote-Friendly Jobs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
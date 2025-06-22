import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { forkJoin, interval, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, LoginComponent, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  private refreshSubscription: Subscription | null = null;
  public lastRefreshed: Date = new Date();
  public isAuthenticated = false;
  public authError = '';
  public playerMetric: 'gamesPlayed' | 'averageScore' = 'gamesPlayed';
  // Aggregate data chart
  public aggregateChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Game Statistics'
      }
    }
  };

  public aggregateChartData: ChartData = {
    labels: ['Total Games', 'Total Players'],
    datasets: [
      {
        data: [0, 0],
        label: 'Totals',
        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)']
      }
    ]
  };

  public aggregateChartType: ChartType = 'bar';

  // API usage chart
  public apiChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'API Usage'
      }
    }
  };

  public apiChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'API Usage Count',
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  };

  public apiChartType: ChartType = 'pie';

  // Games per day chart
  public datesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Games Played Per Day'
      }
    }
  };

  public datesChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Games Played',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)',
        pointBackgroundColor: 'rgb(153, 102, 255)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(153, 102, 255)'
      }
    ]
  };

  public datesChartType: ChartType = 'line';

  // Players chart
  public playersChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Player Information'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            // Use dataset label to determine metric
            const metricLabel = context.dataset.label === 'Games Played' ? 'Games Played' : (context.dataset.label === 'Average Score' ? 'Average Score' : 'Value');
            return `${metricLabel}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        // suggestedMax will be set dynamically in updatePlayersChart
      }
    }
  };

  public playersChartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Players',
        backgroundColor: 'rgba(255, 159, 64, 0.5)'
      }
    ]
  };

  public playersChartType: ChartType = 'bar';

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    this.isAuthenticated = this.authService.isAuthenticated();

    if (this.isAuthenticated) {
      // Initial data fetch if authenticated
      this.fetchData();

      // Set up auto-refresh every 30 seconds
      this.setupAutoRefresh();
    }
  }

  /**
   * Handle successful login
   */
  onLoginSuccess(): void {
    this.isAuthenticated = true;
    this.authError = '';

    // Fetch data after successful login
    this.fetchData();

    // Set up auto-refresh
    this.setupAutoRefresh();
  }

  /**
   * Set up auto-refresh interval
   */
  private setupAutoRefresh(): void {
    // Clean up existing subscription if any
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

    // Set up new subscription
    this.refreshSubscription = interval(30000).subscribe(() => {
      console.log('Auto-refreshing data...');
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  fetchData(): void {
    console.log('Fetching data...');
    forkJoin({
      aggregate: this.adminService.getAggregateData(),
      players: this.adminService.getPlayers(),
      dates: this.adminService.getGamesByDate(),
      scores: this.adminService.getScores(),
      topScores: this.adminService.getTopScores()
    }).subscribe({
      next: (results) => {
        console.log('Data received:', results);
        this.lastRefreshed = new Date();
        this.updateAggregateChart(results.aggregate);
        this.updateApiChart(results.aggregate);
        this.updateDatesChart(results.dates);
        this.updatePlayersChart(results.players, results.scores, results.topScores);
      },
      error: (error) => {
        console.error('Error fetching data:', error);

        // Handle authentication errors
        if (error.status === 401) {
          console.log('Authentication error, user needs to login');
          this.isAuthenticated = false;
          this.authError = 'Your session has expired. Please login again.';

          // Stop auto-refresh if authentication fails
          if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
            this.refreshSubscription = null;
          }
        }
      }
    });
  }

  updateAggregateChart(data: any): void {
    console.log('Updating aggregate chart with data:', data);
    if (data && data.totalGames !== undefined && data.totalPlayers !== undefined) {
      // Create a new reference to trigger change detection
      this.aggregateChartData = {
        ...this.aggregateChartData,
        datasets: [{
          ...this.aggregateChartData.datasets[0],
          data: [data.totalGames, data.totalPlayers]
        }]
      };
      console.log('Aggregate chart data updated:', this.aggregateChartData);
    } else {
      // If no data is available, create a sample dataset
      // This helps with testing when the backend doesn't have data yet
      this.aggregateChartData = {
        ...this.aggregateChartData,
        datasets: [{
          ...this.aggregateChartData.datasets[0],
          data: [8, 4] // Sample data: 8 games, 4 players
        }]
      };
      console.log('Created sample aggregate chart data:', this.aggregateChartData);
      console.warn('Invalid aggregate data format, using sample data:', data);
    }
  }

  updateApiChart(data: any): void {
    console.log('Updating API chart with data:', data);
    if (data && data.apiUsage) {
      const labels = Object.keys(data.apiUsage);
      const values = Object.values(data.apiUsage);

      // Create a new reference to trigger change detection
      this.apiChartData = {
        ...this.apiChartData,
        labels: labels,
        datasets: [{
          ...this.apiChartData.datasets[0],
          data: values as number[]
        }]
      };
      console.log('API chart data updated:', this.apiChartData);
    } else {
      // If no data is available, create a sample dataset
      // This helps with testing when the backend doesn't have data yet
      const sampleLabels = ['dogs', 'cats', 'clouds', 'people'];
      const sampleValues = [3, 2, 1, 2];

      this.apiChartData = {
        ...this.apiChartData,
        labels: sampleLabels,
        datasets: [{
          ...this.apiChartData.datasets[0],
          data: sampleValues
        }]
      };
      console.log('Created sample API chart data:', this.apiChartData);
      console.warn('Invalid API usage data format, using sample data:', data);
    }
  }

  updateDatesChart(data: any): void {
    console.log('Updating dates chart with data:', data);
    if (data && Array.isArray(data)) {
      const labels = data.map(item => item.date);
      const values = data.map(item => item.count);

      // Create a new reference to trigger change detection
      this.datesChartData = {
        ...this.datesChartData,
        labels: labels,
        datasets: [{
          ...this.datesChartData.datasets[0],
          data: values
        }]
      };
      console.log('Dates chart data updated:', this.datesChartData);
    } else {
      // If no data is available, create a sample dataset
      // This helps with testing when the backend doesn't have data yet
      const today = new Date();
      const dates = [];
      const counts = [];

      // Generate data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
        counts.push(Math.floor(Math.random() * 10)); // Random count between 0-9
      }

      this.datesChartData = {
        ...this.datesChartData,
        labels: dates,
        datasets: [{
          ...this.datesChartData.datasets[0],
          data: counts
        }]
      };
      console.log('Created sample dates chart data:', this.datesChartData);
      console.warn('Invalid dates data format, using sample data:', data);
    }
  }

  updatePlayersChart(players: any[], scores: any[], topScores: any[]): void {
    console.log('Updating players chart with data:', { players, scores, topScores });
    if (players && Array.isArray(players) && players.length > 0) {
      const labels = players.map(player => player.username);
      let data: number[];
      if (this.playerMetric === 'gamesPlayed') {
        data = players.map(player =>
          scores.filter(score => score.username === player.username).length
        );
      } else {
        data = players.map(player => {
          const playerScore = scores.find(score => score.username === player.username);
          return playerScore ? playerScore.averageScore : 0;
        });
      }
      // Dynamically set suggestedMax for y-axis
      const max = Math.max(...data, 1);
      if (!this.playersChartOptions) return;
      this.playersChartOptions = {
        ...this.playersChartOptions,
        scales: {
          ...(this.playersChartOptions.scales ?? {}),
          y: {
            ...(this.playersChartOptions.scales?.['y'] ?? {}),
            suggestedMax: max < 5 ? 5 : Math.ceil(max * 1.1)
          }
        }
      };
      this.playersChartData = {
        ...this.playersChartData,
        labels: labels,
        datasets: [{
          ...this.playersChartData.datasets[0],
          data: data,
          label: this.playerMetric === 'gamesPlayed' ? 'Games Played' : 'Average Score'
        }]
      };
      console.log('Players chart data updated:', this.playersChartData);
    } else {
      // If no data is available, create a sample dataset
      const samplePlayers = ['Player1', 'Player2', 'Player3', 'Player4'];
      const sampleScores = [123, 312, 412, 231];
      this.playersChartData = {
        ...this.playersChartData,
        labels: samplePlayers,
        datasets: [{
          ...this.playersChartData.datasets[0],
          data: sampleScores
        }]
      };
      console.log('Created sample players chart data:', this.playersChartData);
      console.warn('Invalid players data format or empty players array, using sample data:', players);
    }
  }
}

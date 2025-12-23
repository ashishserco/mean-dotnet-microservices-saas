import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Claim {
  id: string;
  description: string;
  status: string;
  aiSummary?: string;
  riskScore?: number;
}

@Component({
  selector: 'app-claims',
  template: `
    <h2>My Claims</h2>
    <div *ngFor="let claim of claims" class="claim-card">
      <h3>{{ claim.description }}</h3>
      <p>Status: <strong>{{ claim.status }}</strong></p>
      <div *ngIf="claim.aiSummary" class="ai-insight">
        <p><strong>AI Summary:</strong> {{ claim.aiSummary }}</p>
        <p><strong>Risk Score:</strong> {{ claim.riskScore }}/100</p>
      </div>
    </div>
  `,
  styles: [`
    .claim-card { border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; border-radius: 4px; }
    .ai-insight { background-color: #f0f8ff; padding: 10px; margin-top: 10px; }
  `]
})
export class ClaimsComponent implements OnInit {
  claims: Claim[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // In real app, use environment variable for API URL
    this.http.get<Claim[]>('http://localhost:5001/api/claims')
      .subscribe(data => this.claims = data);
  }
}

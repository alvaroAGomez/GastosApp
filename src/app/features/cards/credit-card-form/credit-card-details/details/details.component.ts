import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports:[CommonModule,
    MatExpansionModule,
    RouterModule 
    ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  cardDetails: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cardDetails = history.state.cardDetails;
    const cardId = this.route.snapshot.paramMap.get('id');
    console.log('Card ID:', cardId);
  }
}

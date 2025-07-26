import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { SuggestionByWeekComponent } from './sub-components/suggestion-by-week/suggestion-by-week.component';
import { SuggestionByMonthComponent } from './sub-components/suggestion-by-month/suggestion-by-month.component';
import { SuggestionByYearComponent } from './sub-components/suggestion-by-year/suggestion-by-year.component';
@Component({
  selector: 'app-restock-suggestion',
  standalone: true,
  imports: [
    MatTabsModule,
    SuggestionByWeekComponent,
    SuggestionByMonthComponent,
    SuggestionByYearComponent,
  ],
  templateUrl: './restock-suggestion.component.html',
  styleUrl: './restock-suggestion.component.css',
})
export class RestockSuggestionComponent implements OnInit {
  tabs = [{ label: 'ByWeek' }, { label: 'ByMonth' }, { label: 'ByYear' }];

  constructor() {}

  selectedIndex = 0;

  ngOnInit(): void {}
}

// Other TaskBoards widget for All TaskBoards View
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:greentoad_app/models/taskboard_model.dart';
import 'package:greentoad_app/view_models/taskboards_viewmodel.dart';

// utilities
import 'package:greentoad_app/utils/capitalize.dart';

class OtherBoards extends ConsumerStatefulWidget {
  const OtherBoards({super.key});

  @override
  OtherBoardsState createState() => OtherBoardsState();
}

class OtherBoardsState extends ConsumerState<OtherBoards> {
  @override
  void initState() {
    super.initState();

    // Fetch boards when the widget is initialized
    Future.microtask(() => ref.read(taskBoardViewModel).fetchBoards());
  }

  @override
  Widget build(BuildContext context) {
    final taskBoardsViewModel = ref.watch(taskBoardViewModel);

    return Padding(
      padding: const EdgeInsets.symmetric(
        vertical: 14.0,
        horizontal: 12.0,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(context),

          // conditionally boards and empty message section
          (taskBoardsViewModel.boards.isEmpty)
              ? Container(
                  margin: const EdgeInsets.only(top: 20.0),
                  child: Center(
                    child: Text(
                      "No boards to show",
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ),
                )
              : Column(
                  children: [
                    for (var board in taskBoardsViewModel.boards)
                      _buildBoardTile(context, board)
                  ],
                ),
        ],
      ),
    );
  }

  // Header widget
  Widget _buildHeader(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10.0),
      child: Row(
        children: [
          const Icon(
            FontAwesomeIcons.tableCellsLarge,
            size: 18.0,
            color: Colors.amber,
          ),
          const SizedBox(width: 10.0),
          Text(
            "Other",
            style: Theme.of(context).textTheme.titleSmall,
          ),
        ],
      ),
    );
  }

  // ListTile Widget
  Widget _buildBoardTile(BuildContext context, TaskBoardModel board) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.0),
      child: ListTile(
        leading: Icon(
          Icons.square_rounded,
          color: board.coverColor,
        ),
        title: Text(
          toCap(board.boardName),
          overflow: TextOverflow.ellipsis,
          style: Theme.of(context).textTheme.labelLarge,
        ),
        subtitle: const Row(
          children: [
            Icon(
              Icons.menu_rounded,
              size: 18.0,
              color: Colors.grey,
            ),
            SizedBox(width: 8.0),
            Icon(
              FontAwesomeIcons.fileLines,
              size: 14.0,
              color: Colors.grey,
            ),
            SizedBox(width: 8.0),
            Icon(
              FontAwesomeIcons.listCheck,
              size: 14.0,
              color: Colors.grey,
            ),
            SizedBox(width: 8.0),
            Icon(
              FontAwesomeIcons.clock,
              size: 14.0,
              color: Colors.grey,
            ),
          ],
        ),
        splashColor: const Color(0x319E9E9E),
        tileColor: Theme.of(context).primaryColor,
        selectedColor: Theme.of(context).primaryColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
        ),
        onTap: () {
          context.push("/taskboards/${board.id}");
        },
      ),
    );
  }
}
